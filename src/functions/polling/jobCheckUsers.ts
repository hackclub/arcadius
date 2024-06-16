import { hoursAirtable } from "../../lib/airtable";
import logger from "../../util/Logger";
import { getHoursUsers } from "../airtable/getHoursUsers";
import { fetchUsers } from "../slack/fetchSlackUsers";

export async function jobCheckUsers() {
  let pUsers = await getHoursUsers();

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
        logger(`Error updating user: ${err}`, "error");
      }
    }
  });
}
