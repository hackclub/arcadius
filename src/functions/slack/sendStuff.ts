import axios from "axios";
import { client } from "../../index";
import { hoursAirtable } from "../../lib/airtable";
import { t } from "../../lib/templates";
import metrics from "../../metrics";
import { flowTriggeredByEnum } from "../../types/flowTriggeredBy";
import { blog } from "../../util/Logger";
import { sleep } from "../../util/sleep";
import { getDmChannelFromAirtable } from "../airtable/getDmChannelFromAirtable";
import { updateUserChannel } from "../airtable/updateUserChannel";

const haccoonId = "U078FB76K5F";

async function sendInitalDM(userId) {
  try {
    metrics.increment("http.request.api_chat-postmessage");
    blog(`Sending initial DM to <@${userId}>`, "info");
    const channel = await client.conversations
      .open({
        users: [userId, haccoonId].join(","),
      })
      .then((res) => res.channel.id);

    await updateUserChannel(userId, channel);

    await sleep(10000);

    await client.chat.postMessage({
      channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: t("onboarding.welcome_hacker", {}),
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Continue…",
                emoji: true,
              },
              action_id: "summon_haccoon_initial",
              value: channel,
            },
          ],
        },
      ],
    });
    return channel;
  } catch (error) {
    blog(`Error in sendInitalDM: ${error}`, "error");
    metrics.increment("slack.send_inital_dm.error");
  }
}

async function postRacoonInitalInstructions(payload) {
  try {
    metrics.increment("http.request.api_chat-postmessage");
    blog(`Posting initial instructions to ${payload.value}`, "info");
    let resp = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: payload.value,
        text: t("onboarding.hedi_intro", {}),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HACKOON_BOT_TOKEN}`,
        },
      }
    );
  } catch (error) {
    blog(`Error in postRacoonInitalInstructions: ${error}`, "error");
    metrics.increment("slack.post_racoon_inital_instructions.error");
  }
}

async function checkOutTheShop(userId) {
  try {
    let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

    metrics.increment("http.request.api_chat-postmessage");
    blog(`Checking out the shop with <@${userId}>`, "info");

    await client.chat.postMessage({
      channel: dmChannel,
      unfurl_links: false,
      unfurl_media: false,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: t("onboarding.shop_prompt", {}),
          },
        },
      ],
    });
  } catch (error) {
    blog(`Error in checkOutTheShop: ${error}`, "error");
    metrics.increment("slack.check_out_the_shop.error");
  }
}

async function sendAlreadyVerifiedDM(userId) {
  try {
    metrics.increment("http.request.api_chat-postmessage");
    blog(`Sending already verified DM to <@${userId}>`, "info");

    let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

    let email = await client.users.info({
      user: userId,
    });
    email = email.user.profile.email;

    await client.chat.postMessage({
      channel: dmChannel,
      unfurl_links: false,
      unfurl_media: false,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: t("onboarding.shop_prompt", {}),
          },
        },
      ],
    });
  } catch (error) {
    blog(`Error in sendAlreadyVerifiedDM: ${error}`, "error");
    metrics.increment("slack.send_already_verified_dm.error");
  }
}

// async function sendFirstPurchaseSubmittedDM(userId) {
//   metrics.increment("http.request.api_chat-postmessage");

//   let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

//   await client.chat.postMessage({
//     channel: dmChannel,
//     blocks: [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: t("onboarding.step_three", {}),
//         },
//       },
//     ],
//   });
// }

async function sendUpgradedDM(userId) {
  try {
    metrics.increment("http.request.api_chat-postmessage");
    blog(`Sending upgraded DM to <@${userId}>`, "info");

    // let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

    const userRecord = await hoursAirtable
      .select({ filterByFormula: `{Slack ID} = '${userId}'`, pageSize: 1 })
      .firstPage();

    const dmChannel = userRecord[0].get("dmChannel");
    const preexisting =
      userRecord[0].get("Flow Triggered By") === flowTriggeredByEnum.hedi;

    if (!preexisting) {
      await client.chat.postMessage({
        channel: dmChannel,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              // correct!
              text: t("onboarding.step_three", {}),
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Upgrade!",
                  emoji: true,
                },
                action_id: "accept_coc",
                value: dmChannel,
              },
            ],
          },
        ],
      });
    } else {
      await client.chat.postMessage({
        channel: dmChannel,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              // correct!
              text: t("onboarding.step_three_preexisting", {}),
            },
          },
        ],
      });
    }
  } catch (error) {
    blog(`Error in sendUpgradedDM: ${error}`, "error");
    metrics.increment("slack.send_upgraded_dm.error");
  }
}

export {
  checkOutTheShop,
  postRacoonInitalInstructions,
  sendAlreadyVerifiedDM,
  // sendFirstPurchaseSubmittedDM,
  sendInitalDM,
  sendUpgradedDM,
};
