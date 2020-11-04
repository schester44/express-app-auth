# Express App Auth

Middleware to authenticate an App with CommandCenter.

## Installation

```
yarn add @iw/express-app-auth
```

## Usage

This package exposes appAuth by default, and verifyRequest as a named export.

```
import appAuth, { verifyRequest } from '@iw/express-app-auth'
```

## appAuth

Returns an authentication middleware taking up (by default) the routes `/auth` and `/auth/callback`.

```
app.use(
  appAuth({
    // if specified, mounts the routes off of the given path
    // eg. /cchd/auth, /cchd/auth/callback
    // defaults to ''
    prefix: '/cchd',
    // your CommandCenter app api key
    apiKey: APP_API_KEY,
    // your CommandCenter app secret
    secret: APP_API_SECRET,
    // scopes to request on the instance
    scopes: ['read_devices', 'write_campaigns'],

    // callback for when auth is completed
    afterAuth(req, res) {
      const { account, accessToken } = ctx.session;

      res.redirect(`/?account=${account}`);
    },
  }),
);
```

**`/auth`**
This route starts the oauth process. It expects a ?account parameter and will error out if one is not present. To install it in an instance just go to /auth?account=myInstanceSubdomain.

**`/auth/callback`**
You should never have to manually go here. This route is purely for CommandCenter to send data back during the oauth process.

###verifyRequest

Returns a middleware to verify requests before letting them further in the chain.

```
app.use(
  verifyRequest({
    // path to redirect to if verification fails
    // defaults to '/auth'
    authRoute: '/foo/auth',
    // path to redirect to if verification fails and there is no account on the query
    // defaults to '/auth'
    fallbackRoute: '/install',
  }),
);
```
