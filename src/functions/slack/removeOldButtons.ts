import { client } from "../../index";
import { t } from "../../lib/templates";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function removeOldHakoonButton(payload) {
  try {
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
  } catch (error) {
    blog(`Error in removeOldHakoonButton: ${error}`, "error");
    metrics.increment("slack.remove_old_hakoon_button.error");
  }
}

export async function removeFinalButton(payload) {
  try {
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
  } catch (error) {
    blog(`Error in removeFinalButton: ${error}`, "error");
    metrics.increment("slack.remove_final_button.error");
  }
}
