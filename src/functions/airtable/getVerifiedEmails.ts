import { verificationsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export async function getVerifiedEmails() {
  try {
    metrics.increment("airtable.get_verifiedemails");
    const tsStart = performance.now();

    blog("Getting all verified users", "info");

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
  } catch (error) {
    blog(`Error in getVerifiedEmails: ${error}`, "error");
    metrics.increment("airtable.get_verifiedemails.error");
  }
}
