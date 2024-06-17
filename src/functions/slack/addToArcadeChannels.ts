import { client } from "../../index";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function addToArcadeChannels(slackId) {
  try {
    metrics.increment("slack.add_to_arcade_channels");
    blog(`Adding user ${slackId} to arcade channels`, "info");

    const channels = [
      "C01504DCLVD", // #scrapbook
      "C077TSWKER0", // #arcade-help
      "C078CMYMW4R", // #arcade-lounge
    ];

    channels.forEach(async (channel) => {
      // invite user to a few channels
      await client.conversations.invite({
        channel: channel,
        users: slackId,
      });
    });
  } catch (error) {
    blog(`Error in addToArcadeChannels: ${error}`, "error");
  }
}
