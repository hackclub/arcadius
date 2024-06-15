import { verificationsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";


export async function getVerifiedEmails() {
  metrics.increment("airtable.get_verifiedemails");
  const tsStart = performance.now();

  let verifiedUsers = await verificationsAirtable;
  let verifiedUsersArray = await verifiedUsers
    .select({
      filterByFormula: `{Verified} = TRUE()`,
      fields: ["Email"],
    })
    .all();

  let verifiedUsersEmails = await verifiedUsersArray.map((record) => {
    return record.get("Email");
  });

  metrics.timing("airtable.get_verifiedemails", performance.now() - tsStart);
  return verifiedUsersEmails;
}
