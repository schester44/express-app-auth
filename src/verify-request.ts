import { compose } from 'compose-middleware';
import debug from 'debug';
import { loginAgainIfDifferentAccount } from './auth/login-again-if-different-account';
import { verifyToken } from './auth/verify-token';
import { Options, Routes } from './types';

const log = debug('appAuth.middleware.verifyRequest');

export default function verifyRequest(givenOptions: Options = {}) {
  const routes: Routes = {
    authRoute: '/auth',
    fallbackRoute: '/auth',
    ...givenOptions,
  };

  log('verifying request');

  // FIXME: Fix the typescript error
  //@ts-ignore
  return compose([loginAgainIfDifferentAccount(routes), verifyToken(routes)]);
}
