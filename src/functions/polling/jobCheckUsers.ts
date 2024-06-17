import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";
import { getHoursUsers } from "../airtable/getHoursUsers";
import { fetchUsers } from "../slack/fetchSlackUsers";

export async function jobCheckUsers() {
    try {
        metrics.increment("airtable.job_checkusers.200");
        const tsStart = performance.now();

        let pUsers = await getHoursUsers();

        blog("Checking users", "info");

        if (!pUsers) {
            blog("No users found in airtable", "error");
            return;
        }

        pUsers.forEach(async (user) => {
            // run fetchUsers for the user
            let tU = await fetchUsers(user["Email"]);

            if (tU == user["Email"]) {
                // mark the user as a fullUser in airtable
                try {
                    // find the airtable record for the user
                    const userRec = await hoursAirtable
                        .select({
                            filterByFormula: `{Slack ID} = '${user["Slack ID"]}'`,
                            pageSize: 1,
                        })
                        .firstPage();
                    // update the record
                    await hoursAirtable.update(userRec[0].id, {
                        isFullUser: true,
                    });
                } catch (err) {
                    blog(`Error updating user: ${err}`, "error");
                }
            }
        });
    } catch (error) {
        blog(`Error in jobCheckUsers: ${error}`, "error");
        metrics.increment("airtable.job_checkusers.500");
    }
}
