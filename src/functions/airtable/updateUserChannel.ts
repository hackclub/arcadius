import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function updateUserChannel(slackId, channelId) {
    try {
        metrics.increment("airtable.update_userchannel.200");
        const tsStart = performance.now();
        blog(`Updating user ${slackId} with channel ${channelId}`, "info");
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
                blog(
                    `User ${slackId} updated with channel ${channelId}`,
                    "info"
                );
            }
        } catch (err) {
            blog(
                `Error updating user ${slackId} with channel ${channelId}`,
                "error"
            );
            metrics.increment("airtable.update_userchannel.500");
        }
    } catch (error) {
        blog(`Error in updateUserChannel: ${error}`, "error");
        metrics.increment("airtable.update_userchannel.500");
    }
}
