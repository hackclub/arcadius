import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";


export async function getHoursUsers() {
  metrics.increment("airtable.get_hoursusers");
  const tsStart = performance.now();

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
}
