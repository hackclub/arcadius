import { client } from "../../index";

export async function addToArcadeChannels(slackId) {
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
}
