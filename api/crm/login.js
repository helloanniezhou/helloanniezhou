import {
  createSessionToken,
  sessionCookieHeader,
  verifyPassword,
} from "../_lib/crmSession.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password = process.env.CRM_PASSWORD;
  const secret = process.env.CRM_SESSION_SECRET;
  if (!password || !secret) {
    return res.status(503).json({ error: "CRM is not configured." });
  }

  const { password: input } = req.body ?? {};
  if (!verifyPassword(input, password)) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const token = createSessionToken(secret);
  res.setHeader("Set-Cookie", sessionCookieHeader(token));
  return res.status(200).json({ ok: true });
}
