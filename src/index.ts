import * as dotenv from "dotenv";
dotenv.config();

import { App, ExpressReceiver } from "@slack/bolt";
import axios from "axios";
import colors from "colors";
import { CronJob } from "cron";
import express from "express";
import responseTime from "response-time";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { slackInvite } from "./endpoints/slack-invite";
import { tmp } from "./endpoints/tmp";
import {
  getFirstPurchaseUsers,
  getHoursUsers,
  getInvitationFaults,
  getVerifiedUsers,
  hoursAirtable,
  ordersAirtable,
  sessionsAirtable,
  slackJoinsAirtable,
} from "./functions/airtable";
import { fetchUsers } from "./functions/jankySlackCrap";
import {
  sendAlreadyVerifiedDM,
  sendFirstPurchaseSubmittedDM,
  sendInitalDM,
  sendVerificationDM,
} from "./functions/sendStuff";
import { arcadeStartInteraction } from "./interactions/arcade-start";
import metrics from "./metrics";
import logger from "./util/Logger";
import { inviteUser } from "./util/invite-user";
import { upgradeUser } from "./util/upgrade-user";

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
      await sendInitalDM(client, event.user.id);
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
  switch (payload.value) {
    case "start_playing":
      await arcadeStartInteraction({ ...args, payload: { user } });
      break;

    case "fake_it_final":
      await sendFirstPurchaseSubmittedDM(client, user);
      break;
  }
});

app.command(/.*?/, async ({ ack, body, client }) => {
  await ack();
  metrics.increment(`slack.command.${body.command}`);

  // This is not used
});

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/slack-invite", slackInvite);
receiver.router.post("/tmp", tmp);
receiver.router.post("/demo", (req) => {
  demo(req.body.userId);
  // upgradeUser(client, "U077HDMHF8E");
});

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
  await app.client.chat.postMessage({
    // LOG_CHANNEL= "C077F5AVB38", # Prod Logging
    // LOG_CHANNEL= "C069N64PW4A", # secret testing of secret things
    channel: "C069N64PW4A",
    text: `I AM ALIVE! :heart-eng: :robot_face: \n\n What'da know? I'm running in the env *${process.env.NODE_ENV}*! :tada:`,
  });
};

async function demo(userId: string) {
  console.log(`Demoing ${userId}`);
  try {
    const userRecord = (
      await hoursAirtable
        .select({ filterByFormula: `{Slack ID} = '${userId}'` })
        .all()
    ).at(0);

    if (userRecord) {
      const fields = userRecord.fields;
      console.log(`Running a demo for ${fields.Name} (${userId})`);
      // console.log(`Running a demo for ${fields.Name} (${userId})`, fields);

      const sessionIds = fields["Sessions"] as Array<string>;
      if (sessionIds) {
        console.log(`Destroying ${sessionIds.length} sessions`);
        await sessionsAirtable.destroy(sessionIds);
      }

      const orderIds = fields["Orders"] as Array<string>;
      if (orderIds) {
        console.log(`Destroying ${orderIds.length} orders`);
        await ordersAirtable.destroy(orderIds);
      }

      await hoursAirtable.update(userRecord.id, {
        verificationDmSent: false,
        minimumHoursSubmitted: false,
        minimumHoursConfirmed: false,
        verificationConfirmed: false,
        isFullUser: false,
        firstPurchaseSubmitted: false,
      });

      sendInitalDM(client, userId);
    } else {
      logger(`No existing arcade record for slack ID ${userId}`, "error");
    }
  } catch (err) {
    logger(`Error running demo for ${userId}: ${err}`, "error");
  }
}

async function jobCheckUsers() {
  let pUsers = await getHoursUsers();

  pUsers.forEach(async (user) => {
    // run fetchUsers for the user
    let tU = await fetchUsers(user["Email"]);

    if (tU == user["Email"]) {
      // mark the user as a fullUser in airtable
      try {
        // find the airtable record for the user
        const userRec = await hoursAirtable
          .select({
            filterByFormula: `{Slack ID} = '${user["Slack ID"]}'`,
            pageSize: 1,
          })
          .firstPage();
        // update the record
        await hoursAirtable.update(userRec[0].id, {
          isFullUser: true,
        });
      } catch (err) {
        logger(`Error updating user: ${err}`, "error");
      }
    }
  });
}

async function checkUserHours() {
  let USERS = await getHoursUsers();
  let usersWithMoreThanMinimumHours = USERS.filter((user) => {
    let minutesApproved = Number(user["Minutes (Approved)"] ?? 0);
    return minutesApproved / 60 >= 3;
  });

  let tmp = await getVerifiedUsers();

  // make an array of 'Hack Club Slack ID's
  let verifiedUsers = tmp.map((user) => user["Hack Club Slack ID"]);

  // check if the user has minimumHoursConfirmed === true
  // if not, send them a DM
  if (usersWithMoreThanMinimumHours.length > 0) {
    usersWithMoreThanMinimumHours.forEach(async (user) => {
      if (user["verificationDmSent"] === true && user["isFullUser"] === true) {
        return;
      } else {
        if (user["isFullUser"] === true) {
          return;
        } else {
          if (user["verificationDmSent"] !== true) {
            if (
              verifiedUsers.includes(user["Slack ID"]) &&
              user["verificationDmSent"]
            ) {
              await sendAlreadyVerifiedDM(
                app.client,
                user["Slack ID"],
                user["Internal ID"]
              ).then(() => {
                upgradeUser(client, user["Slack ID"]);
              });
            } else {
              await sendVerificationDM(app.client, user["Slack ID"]);
            }

            try {
              const userRec = await hoursAirtable
                .select({
                  filterByFormula: `{Slack ID} = '${user["Slack ID"]}'`,
                  pageSize: 1,
                })
                .firstPage();

              await hoursAirtable.update(userRec[0].id, {
                verificationDmSent: true,
              });
            } catch (err) {
              logger(`Error updating user: ${err}`, "error");
            }
          } else {
            return;
          }
        }
      }
    });
  }
}

async function pollInvitationFaults() {
  try {
    const uninvitedUsers = await getInvitationFaults();

    uninvitedUsers
      .map((record) => record)
      .forEach((record) => {
        let email = record.fields["Email"];

        inviteUser({ email }).then((v) => {
          if (v) slackJoinsAirtable.update(record.id, { Invited: true });
        });
      });
  } catch (err) {
    logger(`Error polling invitation faults: ${err}`, "error");
  }
}

async function pollFirstPurchaseUsers() {
  if (0 > 1) {
    const users = await getFirstPurchaseUsers();

    users.forEach((record) => {
      sendFirstPurchaseSubmittedDM(app.client, record.get("Slack ID"));

      // Update the associated record for this user in the hoursAirtable to set firstPurchaseSubmitted to true
      hoursAirtable.update(record.id, {
        firstPurchaseSubmitted: true,
      });
    });
  }
}

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

new CronJob(
  "*/3 * * * * *",
  async function () {
    logger("Checking full users against arcade users.", "cron");
    // await jobCheckUsers();
  },
  null,
  true,
  "America/New_York"
);

new CronJob(
  "*/5 * * * * *",
  async function () {
    // logger("Checking for users with more than minimum hours.", "cron");
    // await checkUserHours();
  },
  null,
  true,
  "America/New_York"
);

// FIXME: This needs to be slow enough to not hit before the slack invite is sent reguarly
new CronJob(
  "*/5 * * * * *",
  async function () {
    logger("Checking for slack invitation faults.", "cron");
    await pollInvitationFaults();
  },
  null,
  true,
  "America/New_York"
);

new CronJob(
  "*/5 * * * * *",
  async function () {
    // logger("Polling for first purchase users.", "cron");
    // await pollFirstPurchaseUsers();
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
