import * as dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";

import metrics from "../metrics";
import logger from "../util/Logger";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});
const client = app.client;

export async function upgradeSlackUser(client, slackId) {
  metrics.increment("slack.upgradeUser");
  const tsStart = performance.now();

  const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN;
  const user = slackId;
  const xoxd = process.env.ARCADIUS_SLACK_COOKIE;

  // slog(`Upgrading user ${user}`);

  try {
    await fetch("https://hackclub.slack.com/api/users.admin.setRegular", {
      headers: {
        "User-Agent": "jasper@hackclub.com",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundarykMFpMcwa07hfrBLw",
        cookie: `d=${xoxd}`,
      },
      body: `------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="token"\r\n\r\n${xoxc}\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="user"\r\n\r\n${user}\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="_x_reason"\r\n\r\nadminMembersStore_makeRegular\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="_x_mode"\r\n\r\nonline\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw--\r\n`,
      method: "POST",
    }).then((r) => {

      if (r.ok) {
        metrics.timing("slack.upgradeUser.200", performance.now() - tsStart);
        // slog(`User ${user} upgraded`);
      } else {
        metrics.timing("slack.upgradeUser.400", performance.now() - tsStart);
        // slog(`Error upgrading user ${user}`);
      }
    });
  } catch (e) {
    logger(`Error upgrading user ${e}`, "error");
    // slog(`Error upgrading user ${e}`);
  }
}
