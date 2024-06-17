import { slackJoinsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

// Check for any users that need to be invited but have not been due to an apparent fault in the system.
// Only trigger for users that have joined on or after June 12th, 2024

export async function getInvitationFaults() {
    try {
        metrics.increment("airtable.get_invitationfaults.200");
        const tsStart = performance.now();

        blog("Getting all users that need to be invited", "info");

        const data = await slackJoinsAirtable
            .select({
                filterByFormula: `NOT({Invited})`,
            })
            .all();

        metrics.timing(
            "airtable.get_invitationfaults",
            performance.now() - tsStart
        );
        return data;
    } catch (error) {
        blog(`Error in getInvitationFaults: ${error}`, "error");
        metrics.increment("airtable.get_invitationfaults.500");
    }
}
