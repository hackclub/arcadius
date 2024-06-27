import { hoursAirtable } from "../../lib/airtable";
import { blog } from "../../util/Logger";
import { sendUpgradedDM } from "../slack/sendStuff";

export async function pollVerifications() {
  try {
    blog("Polling for users who have just completed verification", "info");

    const data = await hoursAirtable
      .select({
        // only get records where the feild "Verifications Count" is greater than 0
        filterByFormula: "{Verifications Count} > 0",
      })
      .all();

    // loop through the records
    data.forEach(async (record) => {
      // check to see if they have the finalDm field set to true
      if (record.get("finalDm") === true) {
        return;
      } else {
        // if they don't, send the final DM
        sendUpgradedDM(record.get("Slack ID"));
        // set the finalDm field to true
        await hoursAirtable.update(record.id, {
          finalDm: true,
        });
      }
    });
  } catch (error) {
    blog(`Error in pollVerifications: ${error}`, "error");
  }
}
