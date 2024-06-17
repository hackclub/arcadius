import metrics from "../../metrics";
import { blog } from "../../util/Logger";
import { getVerificationsUsers } from "./getVerificationsUsers";

export async function getVerifiedUsers() {
    try {
        metrics.increment("airtable.get_verifiedusers.200");
        const tsStart = performance.now();

        blog("Getting all verified users", "info");

        const data = await getVerificationsUsers().then((users) => {
            if (!users) {
                return [];
            }

            let verifiedUsers = users.filter(
                (user) =>
                    user["Verification Status"] === "Eligible L1" ||
                    user["Verification Status"] === "Eligible L2"
            );
            return verifiedUsers;
        });

        metrics.timing(
            "airtable.get_verifiedusers",
            performance.now() - tsStart
        );
        return data;
    } catch (error) {
        blog(`Error in getVerifiedUsers: ${error}`, "error");
        metrics.increment("airtable.get_verifiedusers.500");
    }
}
