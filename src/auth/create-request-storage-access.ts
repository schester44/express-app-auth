import { Request, Response, NextFunction } from "express";

import { OAuthStartOptions } from "../types";
import itpHelper from "./client/itp-helper";
import storageAccessHelper from "./client/storage-access-helper";
import requestStorageAccess from "./client/request-storage-access";

import { AuthError } from "./errors";
import Errors from "./errors";

const HEADING = "This app needs access to your browser data";
const BODY =
  "Your browser is blocking this app from accessing your data. To continue using this app, click Continue, then click Allow if the browser prompts you.";
const ACTION = "Continue";

//@ts-ignore
export default function createRequestStorageAccess({
  apiKey,
  prefix,
}: OAuthStartOptions) {
  return function requestStorage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query } = req;
    const { account } = query;

    console.log({ query });
    if (account == null) {
      return next(new AuthError(Errors.AccountParamMissing, 400));
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
      </style>
      <base target="_top">
      <title>Redirecting…</title>
      <script>
        window.apiKey = "${apiKey}";
        window.accountOrigin = "https://${encodeURIComponent(
          account as string
        )}";

        ${itpHelper}
        ${storageAccessHelper}
        ${requestStorageAccess(account as string, prefix)}
      </script>
    </head>
    <body>
      <main id="RequestStorageAccess">
        <h1 class="Polaris-Heading">${HEADING}</h1>
        <p>${BODY}</p>
        
        <button type="button" id="TriggerAllowCookiesPrompt">
          <span>${ACTION}</span>
        </button>
      </main>
    </body>
  </html>`);
  };
}
