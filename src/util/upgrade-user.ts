import * as dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";
import colors from "colors";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});
const client = app.client;

export async function upgradeUser(client, slackId) {
  const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN;
  const user = slackId;
  const xoxd = process.env.ARCADIUS_SLACK_COOKIE;

  try {
    await fetch("https://hackclub.slack.com/api/users.admin.setRegular", {
      headers: {
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundarykMFpMcwa07hfrBLw",
        cookie: `d=${xoxd}`,
      },
      body: `------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="token"\r\n\r\n${xoxc}\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="user"\r\n\r\n${user}\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="_x_reason"\r\n\r\nadminMembersStore_makeRegular\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw\r\nContent-Disposition: form-data; name="_x_mode"\r\n\r\nonline\r\n------WebKitFormBoundarykMFpMcwa07hfrBLw--\r\n`,
      method: "POST",
    }).then((r) => r.json());
  } catch (e) {
    console.error(colors.bgRed.bold(`Error upgrading user: ${e}`));
  }
}
