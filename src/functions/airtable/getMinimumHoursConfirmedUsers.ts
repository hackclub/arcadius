import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

// Get all users where {Minutes (Approved)} is greater than 180

export async function getMinimumHoursConfirmedUsers() {
  try {
    metrics.increment("airtable.get_minimumhoursconfirmedusers");
    const tsStart = performance.now();

    blog(
      "getMinimumHoursConfirmedUsers: Getting users with more than 180 minutes",
      "info"
    );

    const data = await hoursAirtable
      .select({
        // filterByFormula: `AND({Minutes (Approved)} > 180, NOT({minimumHoursConfirmed}))`,
      })
      .all();

    metrics.timing(
      "airtable.get_minimumhoursconfirmedusers",
      performance.now() - tsStart
    );
    return data;
  } catch (error) {
    blog(`Error in getMinimumHoursConfirmedUsers: ${error}`, "error");
    metrics.increment("airtable.get_minimumhoursconfirmedusers.error");
  }
}
