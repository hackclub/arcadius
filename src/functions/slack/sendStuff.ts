import axios from "axios";
import { client } from "../../index";
import { t } from "../../lib/templates";
import metrics from "../../metrics";
import { sleep } from "../../util/sleep";
import { updateUserChannel } from "../airtable/updateUserChannel";
import { getDmChannelFromAirtable } from "./getDmChannelFromAirtable";

const haccoonId = "U078FB76K5F";

async function sendInitalDM(userId) {
  metrics.increment("http.request.api_chat-postmessage");
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
}

async function postRacoonInitalInstructions(payload) {
  metrics.increment("http.request.api_chat-postmessage");
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
}

async function checkOutTheShop(userId) {
  let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

  metrics.increment("http.request.api_chat-postmessage");
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
}

async function sendAlreadyVerifiedDM(userId) {
  metrics.increment("http.request.api_chat-postmessage");

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
  metrics.increment("http.request.api_chat-postmessage");

  let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

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
              text: "I accept",
              emoji: true,
            },
            action_id: "accept_coc",
            value: dmChannel,
          },
        ],
      },
    ],
  });
}

export {
  checkOutTheShop,
  postRacoonInitalInstructions,
  sendAlreadyVerifiedDM,
  // sendFirstPurchaseSubmittedDM,
  sendInitalDM,
  sendUpgradedDM,
};
