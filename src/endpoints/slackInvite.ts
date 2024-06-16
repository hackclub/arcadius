import { inviteSlackUser } from "../functions/slack/inviteUser";
import logger from "../util/Logger";

export async function slackInviteEndpoint(req, res) {
  // this endpoint is hit by the form on hackclub.com/arcade
  try {
    const email = req!.body!.email;

    const result = { email };
    if (email) {
      // @ts-ignore
      const { ok, error } = await inviteSlackUser(req.body);
      // @ts-ignore
      result.ok = ok;
      // @ts-ignore
      result.error = error;
    }
    res.json(result);
  } catch (e) {
    logger(`Error in slackInvite: ${e}`, "error");
    res.status(500).json({ ok: false, error: "a fatal error occurred" });
  }
}
