import axios from "axios";
import metrics from "../metrics";
import { updateUserChannel } from "./airtable";

const haccoonId = "U078FB76K5F";

async function sendInitalDM(client, userId) {
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
          text: `Welcome hacker, it's so good to see you! You know what this means, right? You've made it to Step 2 of the Hack Club Arcade!! :summer::joystick:

1. *Join the Slack ✓*
2. *Hack on Projects* ← _You are here_
3. Get Cool Stuff

Hack Club is a rather _big_ place, this Arcade is just one little piece of it. I would show you around, but these old dinosaur bones don't move like they used to…

My dear friend <@U078FB76K5F> can give you a tour though!`,
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

async function sendVerificationDM(client, userId) {
  metrics.increment("http.request.api_chat-postmessage");
  await client.chat.postMessage({
    channel: userId,
    unfurl_links: false,
    unfurl_media: false,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Congratulations on completing your first five hours! Before you can move on to Step 3, we do need you to complete that <https://hack.club/arcade-verify?prefill_Hack+Club+Slack+ID=${userId}&hide_Hack+Club+Slack+ID=true|age verification>. Once that's done, you'll be ready to go! \n\n If you have any questions, feel free to <mailto:arcade@hackclub.com | email us> or ask for help in <#C077TSWKER0>`,
        },
      },
    ],
  });
}

async function sendAlreadyVerifiedDM(client, userId, internalID) {
  metrics.increment("http.request.api_chat-postmessage");
  await client.chat.postMessage({
    channel: userId,
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

You can keep banking hours, or <https:/hack.club/arcade-shop?slack_id=${userId}?internal_id=${internalID}|claim your first arcade prize>! We've also added you to the rest of the slack. It can be a bit overwhelming at first, but some of the channels <https://hackclub.slack.com/canvas/C01AS1YEM8A|here> might help you get oriented.`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Fake first order",
              emoji: true,
            },
            action: "fake_it_final",
          },
        ],
      },
    ],
  });
}

export async function sendFirstPurchaseSubmittedDM(client, userId) {
  metrics.increment("http.request.api_chat-postmessage");
  await client.chat.postMessage({
    channel: userId,
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

export {
  postRacoonInitalInstructions,
  sendAlreadyVerifiedDM,
  sendInitalDM,
  sendVerificationDM,
};
