import { sleep } from "../util/sleep";

export async function joinCaveInteraction(args) {
  const { client, payload } = args;
  const { user } = payload;

  await Promise.all([
    client.chat.postEphemeral({
      text: `oh hello... <@${user.id}> i don't think i recognize you; you must be new in town. \n you may call me 8 Bit! i have tea and a fresh pie cooling off... please come over. \n i just sent you a dm! you can tell by the :ping: to the left.`,
      channel: "C077MH3QRFU",
      user,
    }),
  ]);

  await Promise.all([
    await sleep(1000),
    await client.chat.postMessage({
      text: "oh no! you've fallen into the arcade!",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `oh no! you've fallen into the arcade! INSERT ARCADE INFO HERE`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Start playing! :video_game:",
              },
              value: "start_playing",
            },
          ],
        },
      ],
      // icon_url: transcript('avatar.default'),
      channel: user,
      unfurl_links: false,
    }),
  ]);
}
