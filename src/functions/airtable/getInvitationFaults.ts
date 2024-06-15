import { slackJoinsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";

// Check for any users that need to be invited but have not been due to an apparent fault in the system.
// Only trigger for users that have joined on or after June 12th, 2024

export async function getInvitationFaults() {
  metrics.increment("airtable.get_invitationfaults");
  const tsStart = performance.now();

  const data = await slackJoinsAirtable
    .select({
      filterByFormula: `NOT({Invited})`,
    })
    .all();

  metrics.timing("airtable.get_invitationfaults", performance.now() - tsStart);
  return data;
}
