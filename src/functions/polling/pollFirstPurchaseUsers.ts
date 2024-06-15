import { app } from "../../index";
import { hoursAirtable } from "../../lib/airtable";
import { getFirstPurchaseUsers } from "../airtable/getFirstPurchaseUsers";
import { sendFirstPurchaseSubmittedDM } from "../sendStuff";

export async function pollFirstPurchaseUsers() {
  if (0 > 1) {
    const users = await getFirstPurchaseUsers();

    users.forEach((record) => {
      sendFirstPurchaseSubmittedDM(app.client, record.get("Slack ID"));

      // Update the associated record for this user in the hoursAirtable to set firstPurchaseSubmitted to true
      hoursAirtable.update(record.id, {
        firstPurchaseSubmitted: true,
      });
    });
  }
}
