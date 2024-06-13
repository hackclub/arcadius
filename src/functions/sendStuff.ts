import axios from "axios";

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
  const response = await client.files.uploadV2({
    channel: "C077MH3QRFU",
    file: file.data,
    filename: "play me.m4a",
    // filetype: "m4a",
  });
}

async function sendInitalDM(client, userId) {
  await client.chat.postMessage({
    channel: userId,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Congratulations hacker, you have completed Step 1 of the Summer Arcade :summer::joystick:

1. *Join Hack Club ✓*
2. *Hack on Projects* ← _You are here_
3. Get Cool Stuff

*Step 2: Complete Your First Five Hack Hours*
The Hack Club Slack is a grand labyrinth with hundreds of channels. For now, we'll start with just the ones you need for the Arcade.

*Type \`/hack\` to begin!*

One more thing… please make sure to complete the <https://hack.club/arcade-eligibility?slack_id=${userId}|eligibility verification form>!`,
        },
      },
    ],
  });
}

async function sendVerificationDM(client, userId) {
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
  await client.chat.postMessage({
    channel: userId,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Amazing, you're ready for Step 3 of the Summer Arcade!!

1. *Join Hack Club ✓*
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
  await client.chat.postMessage({
    channel: userId,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `You have arrived. Step 3 is complete, your prize is on its way :gift:

1. *Join Hack Club ✓*
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
