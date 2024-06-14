import axios from "axios";
import metrics from "../metrics";

const haccoonId = "U078FB76K5F";

async function postImage(client) {
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

async function postAudio(client) {
  const file = await axios({
    method: "get",
    url: "https://cloud-dhlcphml7-hack-club-bot.vercel.app/0bounce.mp3",
    responseType: "stream",
    headers: {
      "User-Agent": "jasper@hackclub.com",
    },
  });

  metrics.increment("http.request.api_files-uploadv2");
  const response = await client.files.uploadV2({
    channel: "C077MH3QRFU",
    file: file.data,
    filename: "play me.m4a",
    // filetype: "m4a",
  });
}

async function sendInitalDM(client, userId) {
  metrics.increment("http.request.api_chat-postmessage");
  const channel = await client.conversations
    .open({
      users: [userId, haccoonId].join(","),
    })
    .then((res) => res.channel.id);

  await client.chat.postMessage({
    channel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Welcome hacker, it's so good to see you!! You know what this means, right? You've made it to Step 2 of the Hack Club Arcade :summer::joystick:

1. *Join the Slack ✓*
2. *Hack on Projects* ← _You are here_
3. Get Cool Stuff

Hack Club is a rather _big_ place, the Arcade is just one little piece of it. I would love to show you around, but I'm afraid these old dinosaur bones don't move like they used to…

My dear friend <@U078FB76K5F> can give you a tour though! *Type \`/hack\` to summon her*`,
        },
      },
    ],
  });
}

async function sendVerificationDM(client, userId) {
  metrics.increment("http.request.api_chat-postmessage");
  await client.chat.postMessage({
    channel: userId,
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

async function sendAlreadyVerifiedDM(client, userId) {
  metrics.increment("http.request.api_chat-postmessage");
  await client.chat.postMessage({
    channel: userId,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Well done, well done!!

1. *Join the Slack ✓*
2. *Hack on Projects ✓*
3. *Get Cool Stuff* ← _You are here_

You can keep banking hours, or <https://www.google.com|claim your first arcade prize>! We've also added you to the rest of the slack. It can be a bit overwhelming at first, but some of the channels <https://hackclub.slack.com/canvas/C01AS1YEM8A|here> might help you get oriented.`,
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
            value: "fake_it_final",
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
  postAudio,
  postImage,
  sendAlreadyVerifiedDM,
  sendInitalDM,
  sendVerificationDM,
};
