import * as dotenv from "dotenv";
dotenv.config();

import { App, ExpressReceiver } from "@slack/bolt";
import colors from "colors";
import express from "express";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { verification } from "./endpoints/verification";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/verify", verification);

const logStartup = async (app: App) => {
  await app.client.chat.postMessage({
    // channel: "C077F5AVB38",
    channel: "C069N64PW4A",
    text: `I AM ALIVE! :heart-eng: :robot_face: \n\n What'da know? I'm running in the env *${process.env.NODE_ENV}*! :tada:`,
  });
};

(async (): Promise<void> => {
  await app.start(process.env.PORT || 3000).then(async () => {
    await logStartup(app)
      .then(() => {
        console.log(
          colors.green(
            `⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`
          )
        );
      })
      .catch((err) => {
        console.error(colors.red(`Error starting app: ${err}`));
      });
  });
})();
