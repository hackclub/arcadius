import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { Identifier } from "../../types/Indentifier";
import { blog } from "../../util/Logger";

export async function getDmChannelFromAirtable(params: Identifier) {
  try {
    metrics.increment("airtable.get_dm_channel.200");
    const tsStart = performance.now();

    blog("getDmChannelFromAirtable: Getting dmChannel for user", "info");

    // Determine the type of identifier
    let identifierType: "slackId" | "email" | "internalId" | "unknown" =
      "unknown";

    if ("slackId" in params) {
      identifierType = "slackId";
    } else if ("email" in params) {
      identifierType = "email";
    } else if ("internalId" in params) {
      identifierType = "internalId";
    }

    let userRecord;
    let dmChannel;

    switch (identifierType) {
      case "slackId":
        const slackId = params.slackId;

        userRecord = await hoursAirtable
          .select({ filterByFormula: `{Slack ID} = '${slackId}'`, pageSize: 1 })
          .firstPage();
        dmChannel = userRecord[0].get("dmChannel");

        break;

      case "email":
        const email = params.email;

        userRecord = await hoursAirtable
          .select({ filterByFormula: `{Email} = '${email}'`, pageSize: 1 })
          .firstPage();
        dmChannel = userRecord[0].get("dmChannel");

        break;

      case "internalId":
        const internalId = params.internalId;

        userRecord = await hoursAirtable
          .select({
            filterByFormula: `{Internal ID} = '${internalId}'`,
            pageSize: 1,
          })
          .firstPage();
        dmChannel = userRecord[0].get("dmChannel");

        break;

      default:
        throw new Error(
          "Either slackId, email, or internalId must be provided"
        );
    }

    return dmChannel;
  } catch (error) {
    blog(`Error in getDmChannelFromAirtable: ${error}`, "error");
    metrics.increment("airtable.get_dm_channel.500"); 
}
