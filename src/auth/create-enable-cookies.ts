import { Request, Response, NextFunction } from "express";

import { OAuthStartOptions } from "../types";

import Error, { AuthError } from "./errors";

const HEADING = "Enable cookies";
const BODY =
  "You must manually enable cookies in this browser in order to use this app.";
const FOOTER = `Cookies let the app authenticate you by temporarily storing your preferences and personal
information. They expire after 30 days.`;
const ACTION = "Enable cookies";

// @ts-ignore
export default function createEnableCookies({
  apiKey,
  prefix,
}: OAuthStartOptions) {
  return function enableCookies(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { query } = req;
    const { account } = query;

    if (account == null) {
      return next(new AuthError(Error.AccountParamMissing, 400));
    }

    res.send({
      HEADING,
      BODY,
      FOOTER,
      ACTION,
    });
  };
}
