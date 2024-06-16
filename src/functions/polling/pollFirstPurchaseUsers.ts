import colors from "colors";
import { app } from "../../index";
import { hoursAirtable } from "../../lib/airtable";
import { getFirstPurchaseUsers } from "../airtable/getFirstPurchaseUsers";
import { sendFirstPurchaseSubmittedDM } from "../sendStuff";

export async function pollFirstPurchaseUsers() {
    const users = await getFirstPurchaseUsers();

    console.log(colors.bgBlack(`Users who have just made their first purchase: ${users}`));

    users.forEach(async (record) => {
      sendFirstPurchaseSubmittedDM(app.client, record.get("Slack ID"));

      // Update the associated record for this user in the hoursAirtable to set firstPurchaseSubmitted to true
      await hoursAirtable.update(record.id, {
        firstPurchaseSubmitted: true,
      });
    });
}
