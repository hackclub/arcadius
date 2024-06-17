import { verificationsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function getVerificationsUsers() {
    try {
        metrics.increment("airtable.get_verificationusers.200");
        const tsStart = performance.now();

        blog("Getting all users that need to be verified", "info");

        let users = await verificationsAirtable
            .select({
                // fields: ["Name", "Internal ID", "Slack ID", "Email", "Minutes "]
            })
            .all();

        let usersMap = await users.map((record) => {
            return record.fields;
        });

        metrics.timing(
            "airtable.get_verificationusers",
            performance.now() - tsStart
        );
        return usersMap;
    } catch (error) {
        blog(`Error in getVerificationsUsers: ${error}`, "error");
        metrics.increment("airtable.get_verificationusers.500");
    }
}
