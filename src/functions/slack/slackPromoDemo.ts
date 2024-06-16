import * as dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";

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
  // promote
  let form = new URLSearchParams();
  form.append("token", xoxc);
  form.append("user", userID);

  await fetch(`https://hackclub.slack.com/api/users.admin.setRegular`, {
    headers: { cookie },
    body: form,
    method: "POST",
  })
    .then((r) => r.json())
    .then((x) => console.log(x))
    .catch((e) => console.log(e));
}

export async function demoteSlackUser(userID) {
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
    headers: { cookie },
    body: form,
    method: "POST",
  })
    .then((r) => r.json())
    .then((x) => console.log(x))
    .catch((e) => console.log(e));
}
