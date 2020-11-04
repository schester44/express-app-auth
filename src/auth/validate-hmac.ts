import * as qs from "querystring";
import { Request } from "express";
import crypto from "crypto";

export default function validateHmac(
  hmac: string,
  secret: string,
  query: Request["query"]
): boolean {
  const { hmac: _hmac, ...map } = query;

  const v: { [k: string]: any } = {};

  // Sort params lexographically
  const sortedQuery: { [k: string]: any } = Object.keys(map)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, curr) => {
      acc[curr] = query[curr];
      return acc;
    }, v);

  // convert to query string
  const queryString = qs.stringify(sortedQuery);

  // generate hmac using the client secret
  const generatedHash = crypto
    .createHmac("sha256", secret)
    .update(queryString)
    .digest("hex");

  // compare
  // Ref: https://stackoverflow.com/questions/51486432/what-is-the-preferred-way-of-comparing-hmac-signatures-in-node
  return crypto.timingSafeEqual(
    Buffer.from(generatedHash, "utf-8"),
    Buffer.from(hmac, "utf-8")
  );
}
