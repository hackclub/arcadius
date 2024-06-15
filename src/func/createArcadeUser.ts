import { hoursAirtable } from "../lib/airtable";
import { flowTriggeredByType } from "../types/flowTriggeredBy";
import { slog } from "../util/Logger";

export async function createArcadeUser(slackId, email, name: String, flowTriggeredBy: flowTriggeredByType ) {
slog(`Creating arcade user ${name} with email ${email} triggered by ${flowTriggeredBy}`, "info");

const userRecord = (
  await hoursAirtable
    .select({ filterByFormula: `{Slack ID} = '${slackId}'` })
    .all()
).at(0);

}