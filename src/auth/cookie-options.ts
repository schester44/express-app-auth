import { Request } from "express";

export default function getCookieOptions(req: Request) {
  const userAgent = req.get("user-agent");
  const isChrome = userAgent && userAgent.match(/chrome|crios/i);

  let cookieOptions = {};

  if (isChrome) {
    cookieOptions = {
      sameSite: "none",
      secure: true,
    };
  }

  return cookieOptions;
}
