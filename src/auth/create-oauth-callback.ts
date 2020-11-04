import querystring from 'querystring';
import debug from 'debug';
import fetch from 'node-fetch';
import { Request, Response, NextFunction } from 'express';

import { AuthConfig } from '../types';

import Errors, { AuthError } from './errors';
import validateHmac from './validate-hmac';

const log = debug('appAuth.oauth.oAuthCallback');

export default function createOAuthCallback(config: AuthConfig) {
  return async function oAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query, cookies } = req;
    const { code, hmac, account, state: nonce } = query;
    const { apiKey, secret, afterAuth } = config;

    log('nonce', cookies.appNonce, nonce);

    if (nonce == null || cookies.appNonce !== nonce) {
      return next(new AuthError(Errors.NonceMatchFailed, 403));
    }

    if (account == null) {
      return next(new AuthError(Errors.AccountParamMissing, 400));
    }

    if (validateHmac(hmac as string, secret, query) === false) {
      return next(new AuthError(Errors.InvalidHmac, 400));
    }

    /* eslint-disable @typescript-eslint/camelcase */
    const accessTokenQuery = querystring.stringify({
      code: code as string,
      client_id: apiKey,
      client_secret: secret,
    });
    /* eslint-enable @typescript-eslint/camelcase */

    const accessTokenResponse = await fetch(
      // FIXME: Replace :3446 and add HTTPS://
      `http://${account}:3446/apps/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(accessTokenQuery).toString(),
        },
        body: accessTokenQuery,
      }
    );

    if (!accessTokenResponse.ok) {
      return next(new AuthError(Errors.AccessTokenFetchFailure, 401));
    }

    const { access_token, scope } = await accessTokenResponse.json();

    if (req.session) {
      req.session.account = account;
      req.session.accessToken = access_token;
      req.session.app_scope = scope;
    }

    if (afterAuth) {
      await afterAuth(req, res, next);
    }
  };
}
