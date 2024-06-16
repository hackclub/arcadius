import * as dotenv from "dotenv";
dotenv.config();

import { App, ExpressReceiver } from "@slack/bolt";
import axios from "axios";
import colors from "colors";
import express from "express";
import responseTime from "response-time";

import { CronJob } from "cron";
import { getDmChannelEndpoint } from "./endpoints/getDmChannel";
import { healthEndpoint } from "./endpoints/health";
import { indexEndpoint } from "./endpoints/index";
import { slackInviteEndpoint } from "./endpoints/slackInvite";
import { createArcadeUser } from "./functions/airtable/createArcadeUser";
import { checkUserHours } from "./functions/polling/checkUserHours";
import { pollFirstPurchaseUsers } from "./functions/polling/pollFirstPurchaseUsers";
import { pollVerifications } from "./functions/polling/pollVerifications";
import { removeOldHakoonButton } from "./functions/removeOldHakoonButton";
import {
  postRacoonInitalInstructions,
  sendInitalDM,
} from "./functions/sendStuff";
import { demoteSlackUser, promoteSlackUser } from "./functions/slackPromoDemo";
import { t } from "./lib/templates";
import metrics from "./metrics";
import { flowTriggeredByEnum } from "./types/flowTriggeredBy";
import logger, { slog } from "./util/Logger";
import { protectAtAllCosts } from "./util/middlewear/auth";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

app.event(/.*/, async ({ event, client }) => {
  metrics.increment(`slack.event.${event.type}`);
  switch (event.type) {
    case "team_join":
      // check if username starts with test
      // @ts-ignore
      if (event.user.profile.guest_invited_by === "U078MRX71TJ") {
        const userInfo = await client.users.info({ user: event.user.id });
        // @ts-ignore
        console.log(userInfo.user.profile);
        // @ts-ignore
        const email = userInfo.user.profile.email!;
        // @ts-ignore
        const name = userInfo.user.profile.real_name_normalized!;
        console.log({ email, name });
        let flowTriggeredBy: flowTriggeredByEnum = flowTriggeredByEnum.arcadius;
        console.log({ flowTriggeredBy });
        await createArcadeUser(event.user.id, email, name, flowTriggeredBy);
        console.log(`Created arcade user for ${name} (${email})`);
        const channel = await sendInitalDM(event.user.id);
      }
      break;
  }
});

app.action(/.*?/, async (args) => {
  const { ack, respond, payload, client, body } = args;
  const user = body.user.id;

  await ack();

  // @ts-ignore
  metrics.increment(`slack.action.${payload.value}`);

  // @ts-ignore
  switch (payload.action_id) {
    case "summon_haccoon_initial":
      metrics.increment("slack.action.summon_haccoon_initial");
      await removeOldHakoonButton(body);
      await postRacoonInitalInstructions(payload);
      break;
    case "accept_coc":
      metrics.increment("slack.action.accept_coc");
      await promoteSlackUser(user);
      break;
  }
});

app.command(/.*?/, async ({ ack, body, client }) => {
  await ack();
  metrics.increment(`slack.command.${body.command}`);
  // This is not used
});

receiver.router.use(express.json());
receiver.router.get("/", indexEndpoint);
receiver.router.get("/ping", healthEndpoint);
receiver.router.get("/up", healthEndpoint);
receiver.router.post("/slack-invite", protectAtAllCosts, slackInviteEndpoint);
receiver.router.post(
  "/existing-user-start",
  protectAtAllCosts,
  async (req, res) => {
    const userId = req.body.userId;
    console.log(`Creating arcade user for ${userId}`);
    const user = (await client.users.info({ user: userId })).user;
    try {
      let triggeredBy: flowTriggeredByEnum = flowTriggeredByEnum.hedi;

      const arcadeUser = await createArcadeUser(
        userId,
        user.profile.email,
        user.profile.real_name,
        triggeredBy
      );
      const channel = await sendInitalDM(req.body.userId);
      // @ts-ignore
      let airtableRecId = arcadeUser.id;

      res
        .status(200)
        .json({ channelId: channel, airtableRecId: airtableRecId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "a fatal error occurred" });
    }
  }
);
receiver.router.post("/demo", protectAtAllCosts, (req) => {
  demoteSlackUser(req.body.userId);
});
receiver.router.get("/get-dm-channel", getDmChannelEndpoint);

receiver.router.use(
  responseTime((req, res, time) => {
    const stat = (req.method + "/" + req.url?.split("/")[1])
      .toLowerCase()
      .replace(/[:.]/g, "")
      .replace(/\//g, "_");

    const httpCode = res.statusCode;
    const timingStatKey = `http.response.${stat}`;
    const codeStatKey = `http.response.${stat}.${httpCode}`;
    metrics.timing(timingStatKey, time);
    metrics.increment(codeStatKey, 1);
  })
);

app.use(async ({ payload, next }) => {
  metrics.increment(`slack.request.${payload.type}`);
  await next();
});

// Add metric interceptors for axios
axios.interceptors.request.use((config: any) => {
  config.metadata = { startTs: performance.now() };
  return config;
});

axios.interceptors.response.use((res: any) => {
  const stat = (res.config.method + "/" + res.config.url?.split("/")[1])
    .toLowerCase()
    .replace(/[:.]/g, "")
    .replace(/\//g, "_");

  const httpCode = res.status;
  const timingStatKey = `http.request.${stat}`;
  const codeStatKey = `http.request.${stat}.${httpCode}`;
  metrics.timing(
    timingStatKey,
    performance.now() - res.config.metadata.startTs
  );
  metrics.increment(codeStatKey, 1);

  return res;
});

const logStartup = async (app: App) => {
  let env = process.env.NODE_ENV;
  slog(t("app.startup", { environment: env }), "info");
};

app.start(process.env.PORT || 3000).then(async () => {
  await logStartup(app);
  console.log(
    colors.bgCyan(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}`)
  );
});

// Heartbeat
new CronJob(
  "0 * * * * *",
  async function () {
    metrics.increment("heartbeat");
  },
  null,
  true,
  "America/New_York"
);

// new CronJob(
//   "*/3 * * * * *",
//   async function () {
//     logger("Checking full users against arcade users.", "cron");
//     await jobCheckUsers();
//   },
//   null,
//   true,
//   "America/New_York"
// );

new CronJob(
  "*/5 * * * * *",
  async function () {
    logger("Checking for users with more than minimum hours.", "cron");
    await checkUserHours();
  },
  null,
  true,
  "America/New_York"
);

// FIXME: This needs to be slow enough to not hit before the slack invite is sent reguarly
new CronJob(
  "*/5 * * * * *",
  async function () {
    // logger("Checking for slack invitation faults.", "cron");
    // DO NOT UNCOMMENT THIS RIGHT NOW!!!!!!!!!!!!!! (Remeber to reenable slack joins base access on the token)
    // await pollInvitationFaults();
  },
  null,
  true,
  "America/New_York"
);

new CronJob(
  "*/5 * * * * *",
  async function () {
    logger("Polling for first purchase users.", "cron");
    await pollFirstPurchaseUsers();
  }, // onTick
  null, // onComplete
  true, // start
  "America/New_York" // timeZone
);

new CronJob(
  "*/4 * * * * *",
  async function () {
    logger("Polling for verified users.", "cron");
    await pollVerifications();
  }, // onTick
  null, // onComplete
  true, // start
  "America/New_York" // timeZone
);

// new CronJob(
//   "0 * * * * *",
//   function()
//   null,
//   true,
//   "America/New_York"
// );

const client: any = app.client;
export { app, client };
