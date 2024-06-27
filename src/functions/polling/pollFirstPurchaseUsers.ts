import colors from "colors";
import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";
import { getFirstPurchaseUsers } from "../airtable/getFirstPurchaseUsers";
// import { sendFirstPurchaseSubmittedDM } from "../slack/sendStuff";

export async function pollFirstPurchaseUsers() {
  try {
    metrics.increment("polling.poll_firstpurchaseusers");

    blog("Polling for users who have just made their first purchase", "info");

    const users = await getFirstPurchaseUsers();

    console.log(
      colors.bgBlack(`Users who have just made their first purchase: ${users}`)
    );

    if (!users || users.length === 0) {
      console.log(
        colors.bgBlack("No users have just made their first purchase")
      );
      return;
    } else {
      users.forEach(async (record) => {
        // sendFirstPurchaseSubmittedDM(record.get("Slack ID"));

        // Update the associated record for this user in the hoursAirtable to set firstPurchaseSubmitted to true
        await hoursAirtable.update(record.id, {
          firstPurchaseSubmitted: true,
        });
      });
    }
  } catch (error) {
    blog(`Error in pollFirstPurchaseUsers: ${error}`, "error");
    metrics.increment("polling.poll_firstpurchaseusers.error");
  }
}
