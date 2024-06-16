import axios from "axios";
import { client } from "../../index";
import { t } from "../../lib/templates";
import metrics from "../../metrics";
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

  // console.log(payload);

  // console.log(conversation);

  // send a axios request to POST https://slack.com/api/chat.postMessage

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

  // edit the old message that included the button, to remove the button

  // console.log(resp);
}

async function checkOutTheShop(userId) {
  let dmChannel = await getDmChannelFromAirtable({ slackId: userId });

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
          text: t("onboarding.check_out_shop", {}),
        },
      },
    ],
  });
}

async function sendAlreadyVerifiedDM(userId) {
  metrics.increment("http.request.api_chat-postmessage");

  let dmChannel = await getDmChannelFromAirtable({ slackId: userId });

  // get email from slack api
  // FIXME: this should be a seperate function
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
          text: t("onboarding.step_three_copy_1", {}),
        },
      },
    ],
  });
}

async function sendFirstPurchaseSubmittedDM(userId) {
  metrics.increment("http.request.api_chat-postmessage");

  let dmChannel = await getDmChannelFromAirtable({ slackId: userId! });

  await client.chat.postMessage({
    channel: dmChannel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: t("onboarding.step_three_copy_2", {}),
        },
      },
    ],
  });
}

async function sendUpgradedDM(userId) {
  metrics.increment("http.request.api_chat-postmessage");

  let dmChannel = await getDmChannelFromAirtable({ slackId: userId });

  await client.chat.postMessage({
    channel: dmChannel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: t("onboarding.accept_coc", {}),
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
  sendFirstPurchaseSubmittedDM,
  sendInitalDM,
  sendUpgradedDM,
};
