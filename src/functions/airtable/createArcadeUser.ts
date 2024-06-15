import { hoursAirtable } from "../../lib/airtable";
import { flowTriggeredByEnum } from "../../types/flowTriggeredBy";
import { slog } from "../../util/Logger";

export async function createArcadeUser(slackId, email, name: String, flowTriggeredBy: flowTriggeredByEnum ) {
slog(`Creating Arcade user ${name} with email ${email} triggered by ${flowTriggeredBy}`, "info");

const userRecord = (
  await hoursAirtable
    .select({ filterByFormula: `{Slack ID} = '${slackId}'` })
    .all()
).at(0);

if (!userRecord) {
  // @ts-ignore
  const result = await hoursAirtable.create({
    'Slack ID': slackId,
    Email: email,
    Name: name,
    'Flow Triggered By': flowTriggeredBy,
    'Initial Banked Minutes': 180,
  })
    slog(`Arcade user ${name} created with email ${email} triggered by ${flowTriggeredBy}`, "info");
    return result
} else {
  console.log("User already exists!");
  slog(`Arcade user ${name} already exists, user NOT created.`, "info")
  return userRecord;
}

}