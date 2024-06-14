// @ts-nocheck

import { inviteUser } from "../util/invite-user";

export async function slackInvite(req, res) {
  // this endpoint is hit by the form on hackclub.com/slack
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "No credentials sent!" });
    } else if (
      req.headers.authorization != `Bearer ${process.env.TrashPandaSecret}`
    ) {
      return res.status(403).json({ error: "Invalid credentials sent!" });
    } else {
      const email = req!.body!.email;

      const result = { email };
      if (email) {
        const { ok, error } = await inviteUser(req.body);
        result.ok = ok;
        result.error = error;
      }
      res.json(result);
    }
  } catch (e) {
    console.error(colors.bgRed.bold(`[ERROR]: ${e}`));
    res.status(500).json({ ok: false, error: "a fatal error occurred" });
  }
}
