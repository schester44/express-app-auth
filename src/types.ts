import { Request, Response, NextFunction } from "express";

export interface AuthConfig {
  secret: string;
  apiKey: string;
  serviceDomain?: string;
  afterAuth?(req: Request, res: Response, next: NextFunction): void;
}

export interface OAuthStartOptions extends AuthConfig {
  prefix?: string;
  scopes?: string[];
}

export interface Routes {
  authRoute: string;
  fallbackRoute: string;
}

export type Options = Partial<Routes>;
