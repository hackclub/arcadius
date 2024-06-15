import { verificationsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";


export async function getVerificationsUsers() {
  metrics.increment("airtable.get_verificationusers");
  const tsStart = performance.now();

  let users = await verificationsAirtable
    .select({
      // fields: ["Name", "Internal ID", "Slack ID", "Email", "Minutes "]
    })
    .all();

  let usersMap = await users.map((record) => {
    return record.fields;
  });

  metrics.timing("airtable.get_verificationusers", performance.now() - tsStart);
  return usersMap;
}
