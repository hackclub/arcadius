import { verificationsAirtable } from "../../lib/airtable";
import metrics from "../../metrics";

// Get all users that have just made their first purchase

export async function getFirstPurchaseUsers() {
  metrics.increment("airtable.get_firstpurchaseusers");
  const tsStart = performance.now();

  // Return all users for which the Orders field has a length of 1, and the firstPurchaseSubmitted field is false
  const data = await verificationsAirtable
    .select({
      // filterByFormula: `AND(LEN({Orders}) = 1, NOT({firstPurchaseSubmitted}))`,
    })
    .all();

  metrics.timing(
    "airtable.get_firstpurchaseusers",
    performance.now() - tsStart
  );
  return data;
}
