import axios from "axios";
import { client } from "../index";
import { t } from "../lib/templates";
import metrics from "../metrics";
import { updateUserChannel } from "./airtable/updateUserChannel";
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
      text: `_scurry scurry…_ oh hey wow, new frennd!! hey check out this neat piece of garbage i found, smells rul tasty right right??

_…twitch…_

anyway, Arcade?? try it try it!!
*type \`/hack\` and send it!!*`,
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

async function sendVerificationDM(userId) {
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
          // text: `INSERT AMAZING COPY HERE <https://hack.club/arcade-verify?prefill_Hack+Club+Slack+ID=${userId}&hide_Hack+Club+Slack+ID=true|age verification>. Once that's done, you'll be ready to go! \n\n If you have any questions, feel free to <mailto:arcade@hackclub.com | email us> or ask for help in <#C077TSWKER0>`,
          text: `INSERT AMAZING COPY HERE... run /shop to check out the shop!`,
        },
      },
    ],
  });
}

async function sendAlreadyVerifiedDM(userId, internalID) {
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
          text: `Well done, well done!!

1. *Join the Slack ✓*
2. *Hack on Projects ✓*
3. *Get Cool Stuff* ← _You are here_

You can keep banking hours, or <https:/hack.club/arcade-shop?slack_id=${userId}?internal_id=${internalID}?email${email}|claim your first arcade prize>! We've also added you to the rest of the slack. It can be a bit overwhelming at first, but some of the channels <https://hackclub.slack.com/canvas/C01AS1YEM8A|here> might help you get oriented.`,
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
          text: `You have arrived. Step 3 is complete, your prize is on its way :gift:

1. *Join the Slack ✓*
2. *Hack on Projects ✓*
3. *Get Cool Stuff ✓*

This is just the beginning. You have all summer to keep logging hours and claiming prizes! The Arcade closes on August 31st. Godspeed hacker, we can't wait to see what you build :heart:`,
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
          text: `You have been upgraded to a full user! :tada:`,
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
  postRacoonInitalInstructions,
  sendAlreadyVerifiedDM,
  sendFirstPurchaseSubmittedDM,
  sendInitalDM,
  sendUpgradedDM,
  sendVerificationDM,
};
