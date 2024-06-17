import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";

// Get all users that have just made their first purchase

export async function getFirstPurchaseUsers() {
  try {
    metrics.increment("airtable.get_firstpurchaseusers");
    const tsStart = performance.now();

    blog(
      "getFirstPurchaseUsers: Getting users who have just made their first purchase",
      "info"
    );

    // Return all users for which the Orders field has a length of 1, and the firstPurchaseSubmitted field is false
    const data = await hoursAirtable
      .select({
        filterByFormula: `AND({Order Count} = 1, NOT({firstPurchaseSubmitted}))`,
        // filterByFormula: `{Order Count} = 1`,
      })
      .all();

    metrics.timing(
      "airtable.get_firstpurchaseusers",
      performance.now() - tsStart
    );
    return data;
  } catch (error) {
    blog(`Error in getFirstPurchaseUsers: ${error}`, "error");
    metrics.increment("airtable.get_firstpurchaseusers.error");
  }
}
