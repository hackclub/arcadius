import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { flowTriggeredByEnum } from "../../types/flowTriggeredBy";
import { blog } from "../../util/Logger";

export async function createArcadeUser(
  slackId,
  email,
  name,
  flowTriggeredBy: flowTriggeredByEnum
) {
  try {
    metrics.increment("createArcadeUser");
    const tsStart = performance.now();

    blog(
      `Creating Arcade user \`${name}\` with email \`${email}\` triggered by \`${flowTriggeredBy}\``,
      "info"
    );
    const userRecord = (
      await hoursAirtable
        .select({ filterByFormula: `{Slack ID} = '${slackId}'` })
        .all()
    ).at(0);

    if (!userRecord) {
      // @ts-ignore
      const result = await hoursAirtable.create({
        "Slack ID": slackId,
        Email: email,
        Name: name,
        "Flow Triggered By": flowTriggeredBy,
        "Initial Banked Minutes": 180,
      });
      blog(
        `Arcade user \`${name}\` created with email \`${email}\` triggered by \`${flowTriggeredBy}\``,
        "info"
      );
      metrics.timing("createArcadeUser", performance.now() - tsStart);
      return result;
    } else {
      metrics.timing("createArcadeUser", performance.now() - tsStart);
      blog(`Arcade user ${name} already exists, user NOT created.`, "info");
      return userRecord;
    }
  } catch (error) {
    blog(`Error in createArcadeUser: ${error}`, "error");
    metrics.increment("createArcadeUser.error");
  }
}
