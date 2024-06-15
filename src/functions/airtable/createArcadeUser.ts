import { hoursAirtable } from "../../lib/airtable";
import { flowTriggeredByType } from "../../types/flowTriggeredBy";
import { slog } from "../../util/Logger";

export async function createArcadeUser(slackId, email, name: String, flowTriggeredBy: flowTriggeredByType ) {
slog(`Creating Arcade user ${name} with email ${email} triggered by ${flowTriggeredBy}`, "info");

const userRecord = (
  await hoursAirtable
    .select({ filterByFormula: `{Slack ID} = '${slackId}'` })
    .all()
).at(0);

if (!userRecord) {
  return await hoursAirtable.create({
    'Slack ID': slackId,
    Email: email,
    Name: name,
  }).then((record) => {
    slog(`Arcade user ${name} created with email ${email} triggered by ${flowTriggeredBy}`, "info");
    return record;
  });
} else {
  console.log("User already exists!");
  slog(`Arcade user ${name} already exists, user NOT created.`, "info")
  return userRecord;
}

}