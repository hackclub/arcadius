import { inviteSlackUser } from "../functions/slack/inviteUser";
import metrics from "../metrics";
import { blog } from "../util/Logger";

export async function slackInviteEndpoint(req, res) {
  // this endpoint is hit by the form on hackclub.com/arcade
  try {
    metrics.increment("slackInviteEndpoint");
    const email = req!.body!.email;

    blog(`slackInviteEndpoint: email: ${email}`, "info");

    const result = { email };
    if (email) {
      // @ts-ignore
      const { ok, error } = await inviteSlackUser(req.body);
      // @ts-ignore
      result.ok = ok;
      // @ts-ignore
      result.error = error;
      metrics.increment(
        ok ? "slackInviteEndpoint.success" : "slackInviteEndpoint.error"
      );
      blog(`${result}`, "info");
    } else {
      metrics.increment("slackInviteEndpoint.error");
      // @ts-ignore
      result.ok = false;
      // @ts-ignore
      result.error = "email is required";
      blog(`slackInviteEndpoint: email is required`, "error");
    }
    res.json(result);
  } catch (e) {
    blog(`Error in slackInvite: ${e}`, "error");
    res.status(500).json({ ok: false, error: "a fatal error occurred" });
  }
}
