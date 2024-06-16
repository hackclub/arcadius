import { client } from "../index";
import { t } from "../lib/templates";

export async function removeOldHakoonButton(payload) {
  console.log("removeOldHakoonButton");
  console.log(payload);

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
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "You'll love Hakoon! Have fun!",
        },
      },
    ],
  });
}
