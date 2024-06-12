import * as dotenv from "dotenv";
dotenv.config();

import { App, ExpressReceiver } from "@slack/bolt";
import axios from "axios";
import colors from "colors";
import express from "express";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { slackInvite } from "./endpoints/slack-invite";
import { verification } from "./endpoints/verification";
import { arcadeStartInteraction } from "./interactions/arcade-start";
import { joinCaveInteraction } from "./interactions/join-cave";
// import { setupCaveChannel } from "./setup";
import { sleep } from "./util/sleep";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

async function postImage() {
  // const file = await axios({
  //   method: "get",
  //   url: "https://cloud-45c5n1f77-hack-club.vercel.app/0ezgif.com-gif-maker.gif", //TODO: Change this to something arcade!
  //   responseType: "stream",
  // });
  // const response = await client.files.upload({
  //   channel: "C077MH3QRFU",
  //   file: file.data,
  //   filename: "you enter the arcade.gif",
  // });
  // const response = await client.files.uploadV2({
  //   channel: "C077MH3QRFU",
  //   file: "https://cloud-45c5n1f77-hack-club.vercel.app/0ezgif.com-gif-maker.gif",
  //   filename: "you enter the arcade.gif",
  // });
  // const response = await client.files.
}

async function postAudio() {
  const file = await axios({
    method: "get",
    url: "https://cloud-dhlcphml7-hack-club-bot.vercel.app/0bounce.mp3",
    responseType: "stream",
  });
  console.log({
    channel: "C077MH3QRFU",
  });
  const response = await client.files.uploadV2({
    channel: "C077MH3QRFU",
    file: file.data,
    filename: "play me.m4a",
    // filetype: "m4a",
  });
}

// create a wildcard listerer for all events
app.event(/.*/, async ({ event, client }) => {
  console.log(event);

  switch (event.type) {
    case "member_joined_channel":
      if (event.channel === "C06T7A8E3") {
        await joinCaveInteraction({ client, payload: { user: event.user } });
      }
      break;
  }
});

app.action(/.*?/, async (args) => {
  const { ack, respond, payload, client, body } = args;
  const user = body.user.id;

  await ack();

  // @ts-ignore
  switch (payload.value) {
    case "cave_start":
      await joinCaveInteraction({ ...args, payload: { user } });

      break;

    case "start_playing":
      await arcadeStartInteraction({ ...args, payload: { user } });

      break;
  }
});

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/verify", verification);
receiver.router.post("/slack-invite", slackInvite);

const logStartup = async (app: App) => {
  // await app.client.chat.postMessage({
  //   // channel: "C077F5AVB38",
  //   channel: "C069N64PW4A",
  //   text: `I AM ALIVE! :heart-eng: :robot_face: \n\n What'da know? I'm running in the env *${process.env.NODE_ENV}*! :tada:`,
  // });
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
      .then(() => {
        // setupCaveChannel();
        sleep(100);
      })
      .catch((err) => {
        console.error(colors.red(`Error starting app: ${err}`));
      });
  });
})();

const client: any = app.client;
export { app, client };
