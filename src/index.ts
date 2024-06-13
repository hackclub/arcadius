import * as dotenv from "dotenv";
dotenv.config();

import { App, ExpressReceiver } from "@slack/bolt";
import colors from "colors";
import { CronJob } from "cron";
import express from "express";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { slackInvite } from "./endpoints/slack-invite";
import { tmp } from "./endpoints/tmp";
import { verification } from "./endpoints/verification";
import {
  getHoursUsers,
  getVerifiedUsers,
  hoursAirtable,
} from "./functions/airtable";
import { fetchUsers } from "./functions/jankySlackCrap";
import {
  sendAlreadyVerifiedDM,
  sendInitalDM,
  sendStep3DM,
  sendVerificationDM,
} from "./functions/sendStuff";
import { arcadeStartInteraction } from "./interactions/arcade-start";

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
  switch (payload.value) {
    case "start_playing":
      await arcadeStartInteraction({ ...args, payload: { user } });
      break;

    case "fake_it_forward_unverified":
      await sendVerificationDM(client, user);
      break;

    case "fake_it_forward_verified":
      await sendAlreadyVerifiedDM(client, user);
      break;

    case "fake_it_final":
      await sendStep3DM(client, user);
      break;
  }
});

app.command(/.*?/, async ({ ack, body, client }) => {
  await ack();

  switch (body.command) {
    case "/dm-me":
      sendInitalDM(client, body.user_id);
      break;
  }
});

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/verify", verification);
receiver.router.post("/slack-invite", slackInvite);
receiver.router.post("/tmp", tmp);

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
      .then(async () => {
        new CronJob(
          "*/3 * * * * *",
          async function () {
            console.log(
              colors.yellow(
                "Running cron job to check full users against arcade users."
              )
            );
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
                  console.error(colors.red(`Error updating user: ${err}`));
                }
              }
            });
          }, // onTick
          null, // onComplete
          true, // start
          "America/New_York" // timeZone
        );

        new CronJob(
          "*/5 * * * * *",
          async function () {
            console.log(
              colors.blue(
                "Running cron job to check for users with more than 5 hours."
              )
            );
            let USERS = await getHoursUsers();
            let usersWithMoreThan5Hours = USERS.filter((user) => {
              let minutesApproved = Number(user["Minutes (Approved)"] ?? 0);
              return minutesApproved / 60 >= 5;
            });

            // check if the user has advancedToStepTwo === true
            // if not, send them a DM
            if (usersWithMoreThan5Hours.length > 0) {
              usersWithMoreThan5Hours.forEach(async (user) => {
                // TODO ~ Handle Cases where user is already a full user. This should silently error (skip) as it will be caught by ops during the order stage, but we need to handle this to prevent this bot dm'ing the user at any stage

                if (user["advancedToStepTwo"] === true) {
                  return;
                } else {
                  try {
                    let tmp = await getVerifiedUsers();

                    // make an array of 'Hack Club Slack ID's
                    let verifiedUsers = tmp.map(
                      (user) => user["Hack Club Slack ID"]
                    );

                    if (verifiedUsers.includes(user["Slack ID"])) {
                      await sendAlreadyVerifiedDM(app.client, user["Slack ID"]);
                    } else {
                      await sendVerificationDM(app.client, user["Slack ID"]);
                    }
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
                        advancedToStepTwo: true,
                      });
                    } catch (err) {
                      console.error(colors.red(`Error updating user: ${err}`));
                    }
                  } catch (err) {
                    console.error(colors.red(`Error: ${err}`));
                  }
                }
              });
            }
          }, // onTick
          null, // onComplete
          true, // start
          "America/New_York" // timeZone
        );
      })
      .catch((err) => {
        console.error(colors.red(`Error starting app: ${err}`));
      });
  });
})();

const client: any = app.client;
export { app, client };
