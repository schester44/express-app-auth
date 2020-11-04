import { Request, Response } from 'express';
import { Routes } from '../types';

export function clearSession(req: Request) {
  if (req.session) {
    delete req.session.account;
    delete req.session.accessToken;
  }
}

export function redirectToAuth(
  { fallbackRoute, authRoute }: Routes,
  req: Request,
  res: Response
) {
  const { account } = req.query;

  const routeForRedirect =
    account == null ? fallbackRoute : `${authRoute}?account=${account}`;

  res.redirect(routeForRedirect);
}
