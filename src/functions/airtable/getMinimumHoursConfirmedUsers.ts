import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";

// Get all users where {Minutes (Approved)} is greater than 180

export async function getMinimumHoursConfirmedUsers() {
  metrics.increment("airtable.get_minimumhoursconfirmedusers");
  const tsStart = performance.now();

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
}
