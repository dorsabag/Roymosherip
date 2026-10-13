import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import type { RequestHandler } from "express";

declare module "express-session" {
  interface SessionData { admin?: boolean }
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET);
const PgStore = connectPgSimple(session);
// No fallback password or ephemeral secret. Missing setup disables administration.
export const adminSession: RequestHandler = (req, res, next) => {
  if (!process.env.SESSION_SECRET) { next(); return; }
  sessionMiddleware(req, res, next);
};
const sessionMiddleware = process.env.SESSION_SECRET ? session({
  store: new PgStore({ pool, tableName: "admin_sessions", createTableIfMissing: false }),
  secret: process.env.SESSION_SECRET,
  name: "roy.admin",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "strict", secure: "auto", maxAge: 1000 * 60 * 60 * 4, path: "/api/admin" },
}) : ((_req, _res, next) => next()) as RequestHandler;

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!adminConfigured() || !req.session?.admin) {
    res.status(401).json({error:"נדרשת התחברות לניהול"}); return;
  }
  next();
};

// Reject cross-site writes including login/logout; no permissive CORS.
export const sameOrigin: RequestHandler = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) { next(); return; }
  const origin = req.get("origin");
  const fetchSite = req.get("sec-fetch-site");
  if (fetchSite === "cross-site" || (origin && (() => {
    try { return new URL(origin).host !== req.get("host"); } catch { return true; }
  })())) { res.status(403).json({error:"בקשה לא מורשית"}); return; }
  next();
};