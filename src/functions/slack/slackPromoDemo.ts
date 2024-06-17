import * as dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});
const client = app.client;

const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN!;
const xoxd = process.env.ARCADIUS_SLACK_COOKIE!;
const cookie = `d=${xoxd}`;

export async function promoteSlackUser(userID) {
  try {
    blog(`Promoting user <@${userID}>`, "info");

    // promote
    let form = new URLSearchParams();
    form.append("token", xoxc);
    form.append("user", userID);

    await fetch(`https://hackclub.slack.com/api/users.admin.setRegular`, {
      headers: { cookie, "User-Agent": "jasper@hacklub.com" },
      body: form,
      method: "POST",
    })
      .then((r) => r.json())
      .then((x) => {
        // TODO ~ reenable this with proper channels and make sure it doesn't error
        // addToArcadeChannels(userID);
        console.log(x);
      })
      .catch((e) => console.log(e));
  } catch (error) {
    blog(`Error in promoteSlackUser: ${error}`, "error");
    metrics.increment("slack.promote_slack_user.error");
  }
}

export async function demoteSlackUser(userID) {
  try {
    const channels = [
      "C06SBHMQU8G", // #arcade
    ];

    // demote
    let form = new URLSearchParams();
    form.append("token", xoxc);
    form.append("user", userID);
    form.append("channels", channels.join(","));
    form.append("target_team", "T0266FRGM");

    await fetch("https://hackclub.slack.com/api/users.admin.setRestricted", {
      headers: { cookie, "User-Agent": "jasper@hacklub.com" },
      body: form,
      method: "POST",
    })
      .then((r) => r.json())
      .then((x) => console.log(x))
      .catch((e) => console.log(e));
  } catch (error) {
    blog(`Error in demoteSlackUser: ${error}`, "error");
    metrics.increment("slack.demote_slack_user.error");
  }
}
