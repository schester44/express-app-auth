import querystring from 'querystring';
import debug from 'debug';
//@ts-ignore
import nonce from 'nonce';
import { Request, Response } from 'express';

import { OAuthStartOptions } from '../types';
import getCookieOptions from './cookie-options';

const createNonce = nonce();

const log = debug('appAuth.oauth.oAuthQueryString');

export default function oAuthQueryString(
  req: Request,
  res: Response,
  options: OAuthStartOptions,
  callbackPath: string
) {
  const { hostname } = req;
  const { scopes = [], apiKey } = options;

  const requestNonce = createNonce();

  log('setting appNonce cookie', requestNonce);

  res.cookie('appNonce', requestNonce, getCookieOptions(req));

  /* eslint-disable @typescript-eslint/camelcase */
  const redirectParams = {
    state: requestNonce,
    scope: scopes.join(', '),
    client_id: apiKey,
    redirect_uri: `https://${hostname}${callbackPath}`,
  };
  /* eslint-enable @typescript-eslint/camelcase */

  return querystring.stringify(redirectParams);
}
