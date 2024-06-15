import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { slog } from "../../util/Logger";

export async function updateUserChannel(slackId, channelId) {
  metrics.increment("airtable.update_userchannel");
  const tsStart = performance.now();
  slog(`Updating user ${slackId} with channel ${channelId}`, "info");
  try {
    const user = (
      await hoursAirtable
        .select({ filterByFormula: `{Slack ID} = '${slackId}'` })
        .all()
    ).at(0);
    if (user) {
      hoursAirtable.update(user.id, {
        dmChannel: channelId,
      });
      performance.now() - tsStart;
      slog(`User ${slackId} updated with channel ${channelId}`, "info");
    }
  } catch (err) {
    slog(`Error updating user ${slackId} with channel ${channelId}`, "error");
    console.error(err);
  }
}