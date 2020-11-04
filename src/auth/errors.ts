enum Errors {
  AccountParamMissing = "Expected a valid account query parameter",
  InvalidHmac = "HMAC validation failed",
  AccessTokenFetchFailure = "Could not fetch access token",
  NonceMatchFailed = "Request origin could not be verified",
}

export default Errors;

export class AuthError extends Error {
  public code: number | undefined;

  constructor(message: string, statusCode?: number) {
    super();

    this.code = statusCode;
    this.message = message;
    this.name = "AuthError";
  }
}
