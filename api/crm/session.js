import { parseCookie, CRM_COOKIE, verifySessionToken } from "../_lib/crmSession.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CRM_SESSION_SECRET;
  if (!secret) {
    return res.status(503).json({ ok: false, error: "CRM is not configured." });
  }

  const token = parseCookie(req.headers.cookie, CRM_COOKIE);
  const ok = verifySessionToken(token, secret);
  return res.status(200).json({ ok });
}
