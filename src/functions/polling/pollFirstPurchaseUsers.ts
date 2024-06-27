import colors from "colors";
import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";
import { getFirstPurchaseUsers } from "../airtable/getFirstPurchaseUsers";
import { sendFirstPurchaseSubmittedDM } from "../slack/sendStuff";

export async function pollFirstPurchaseUsers() {
  try {
    metrics.increment("polling.poll_firstpurchaseusers");

    blog("Polling for users who have just made their first purchase", "info");

    const users = await getFirstPurchaseUsers();

    if (!users || users?.length === 0) {
      console.log(
        colors.bgBlack("No users have just made their first purchase")
      );
      return;
    } else {
      users?.forEach(async (record) => {
        // check to see if they have the finalDm field set to true
        if (record.get("verificationDm")) {
          return;
        } else {
          // if they don't, send the verification DM
          const slackId = record.get("Slack ID");
          if (!record.get("Arcade Eligible"))
            sendFirstPurchaseSubmittedDM(slackId);

          // set the verificationDM field to true
          await hoursAirtable.update(record.id, {
            verificationDm: true,
          });
        }

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
