import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function getHoursUsers() {
  try {
    metrics.increment("airtable.get_hoursusers");
    const tsStart = performance.now();

    blog("Getting all users from the hours table", "info");

    let users = await hoursAirtable
      .select({
        // fields: ["Name", "Internal ID", "Slack ID", "Email", "Minutes "]
      })
      .all();

    // make an array of users, where each user is an object with the fields as keys
    let usersMap = await users.map((record) => {
      return record.fields;
    });

    metrics.timing("airtable.get_hoursusers", performance.now() - tsStart);
    return usersMap;
  } catch (error) {
    blog(`Error in getHoursUsers: ${error}`, "error");
    metrics.increment("airtable.get_hoursusers.error");
  }
}
