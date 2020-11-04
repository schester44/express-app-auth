import querystring from "querystring";
import debug from "debug";

import { Request, Response } from "express";

import redirectionPage from "./redirection-page";

const log = debug("appAuth.oauth.createTopLevelRedirect");

export default function createTopLevelRedirect(apiKey: string, path: string) {
  return function topLevelRedirect(req: Request, res: Response) {
    const { hostname, query } = req;
    const { account } = query;

    const queryString = querystring.stringify({ account: account as string });

    log({ hostname, path });

    res.send(
      redirectionPage({
        origin: account as string,
        redirectTo: `https://${hostname}${path}?${queryString}`,
        apiKey,
      })
    );
  };
}
