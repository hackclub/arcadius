import { client } from "../../index";
import { t } from "../../lib/templates";

export async function removeOldHakoonButton(payload) {
  client.chat.update({
    channel: payload.channel.id,
    ts: payload.message.ts,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: t("onboarding.welcome_hacker", {}),
        },
      },
    ],
  });
}

export async function removeFinalButton(payload) {
  client.chat.update({
    channel: payload.channel.id,
    ts: payload.message.ts,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `You have been upgraded to a full user! :tada:`,
        },
      },
    ],
  });
}
