import { Request, Response, NextFunction } from 'express';
import debug from 'debug';
import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import createEnableCookies from './create-enable-cookies';
import createTopLevelOAuthRedirect from './create-top-level-oauth-redirect';
import createRequestStorageAccess from './create-request-storage-access';
import { OAuthStartOptions } from '../types';

const DEFAULT_SERVICE_DOMAIN = 'dev.local';

export const TOP_LEVEL_OAUTH_COOKIE_NAME = 'appTopLevelOAuth';
export const TEST_COOKIE_NAME = 'appTestCookie';
export const GRANTED_STORAGE_ACCESS_COOKIE_NAME = 'app.granted_storage_access';

const log = debug('appAuth.root');

function hasCookieAccess({ cookies }: Request) {
  return Boolean(cookies[TEST_COOKIE_NAME]);
}

function grantedStorageAccess({ cookies }: Request) {
  return Boolean(cookies[GRANTED_STORAGE_ACCESS_COOKIE_NAME]);
}

function shouldPerformInlineOAuth({ cookies }: Request) {
  return Boolean(cookies[TOP_LEVEL_OAUTH_COOKIE_NAME]);
}

export default function createAppAuth(options: OAuthStartOptions) {
  const config = {
    scopes: [],
    prefix: '',
    serviceDomain: DEFAULT_SERVICE_DOMAIN,
    ...options,
  };

  const { prefix } = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthCallbackPath = `${oAuthStartPath}/callback`;

  const oAuthStart = createOAuthStart(config, oAuthCallbackPath);
  const oAuthCallback = createOAuthCallback(config);

  const inlineOAuthPath = `${prefix}/auth/inline`;
  const topLevelOAuthRedirect = createTopLevelOAuthRedirect(
    config.apiKey,
    inlineOAuthPath
  );

  const enableCookiesPath = `${oAuthStartPath}/enable_cookies`;
  const enableCookies = createEnableCookies(config);
  const requestStorageAccess = createRequestStorageAccess(config);

  log({
    oAuthStartPath,
    oAuthCallbackPath,
    enableCookiesPath,
    inlineOAuthPath,
  });

  return async function appAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const fullPath = req.baseUrl + req.path;

    log({
      fullPath,
      cookieAccess: hasCookieAccess(req),
      storageAccess: grantedStorageAccess(req),
    });

    if (
      fullPath === oAuthStartPath &&
      !hasCookieAccess(req) &&
      !grantedStorageAccess(req)
    ) {
      log('do requestStorageAccess');

      await requestStorageAccess(req, res, next);
      return;
    }

    if (
      fullPath === inlineOAuthPath ||
      (fullPath === oAuthStartPath && shouldPerformInlineOAuth(req))
    ) {
      log('do oAuthStart', { fullPath, inlineOAuthPath, oAuthStartPath });

      await oAuthStart(req, res, next);
      return;
    }

    if (fullPath === oAuthStartPath) {
      log('do topLevelOAuthRedirect');

      await topLevelOAuthRedirect(req, res);
      return;
    }

    if (fullPath === oAuthCallbackPath) {
      log('do oAuthCallback');

      await oAuthCallback(req, res, next);
      return;
    }

    if (fullPath === enableCookiesPath) {
      log('do enable cookies');

      await enableCookies(req, res, next);
      return;
    }

    await next();
  };
}

export { default as validateHMAC } from './validate-hmac';
export { default as verifyRequest } from '../verify-request';
