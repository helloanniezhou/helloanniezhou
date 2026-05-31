import crypto from "node:crypto";

export const CRM_COOKIE = "crm_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(secret) {
  const exp = Date.now() + SESSION_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token, secret) {
  if (!token || !secret) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload, secret);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function parseCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

function cookieBase() {
  const secure =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  return secure ? "HttpOnly; Secure; SameSite=Strict" : "HttpOnly; SameSite=Lax";
}

export function sessionCookieHeader(token) {
  const maxAge = Math.floor(SESSION_MS / 1000);
  return `${CRM_COOKIE}=${token}; ${cookieBase()}; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookieHeader() {
  return `${CRM_COOKIE}=; ${cookieBase()}; Path=/; Max-Age=0`;
}

export function verifyPassword(input, expected) {
  if (input == null || expected == null) return false;
  const a = Buffer.from(String(input));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function requireCrmSession(req, res) {
  const secret = process.env.CRM_SESSION_SECRET;
  if (!secret) {
    res.status(503).json({ error: "CRM is not configured." });
    return false;
  }
  const token = parseCookie(req.headers.cookie, CRM_COOKIE);
  if (!verifySessionToken(token, secret)) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
