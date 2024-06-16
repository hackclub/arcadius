import { hoursAirtable } from "../../lib/airtable";
import { sendUpgradedDM } from "../sendStuff";

export async function pollVerifications() {
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
      // if they do, log it
      console.log(
        `User ${record.get("Slack ID")} has already received the final DM`
      );
      return;
    } else {
      // if they don't, send the final DM
      console.log(
        `User ${record.get("Slack ID")} has not received the final DM`
      );
      sendUpgradedDM(record.get("Slack ID"));
      // set the finalDm field to true
      await hoursAirtable.update(record.id, {
        finalDm: true,
      });
    }
  });
}
