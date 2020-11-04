import { Request, Response, NextFunction } from 'express';
import debug from 'debug';

import { Routes } from '../types';
import { clearSession, redirectToAuth } from './utils';

const log = debug('appAuth.middleware.loginAgainIfDifferentAccount');

export function loginAgainIfDifferentAccount(routes: Routes) {
  return async function loginAgainIfDifferentAccountMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query, session } = req;

    if (session && query.account && session.account !== query.account) {
      log('clearing session');

      clearSession(req);
      redirectToAuth(routes, req, res);
      return;
    }

    await next();
  };
}
