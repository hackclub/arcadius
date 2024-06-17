import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";

// Get all users that have just made their first purchase

export async function getFirstPurchaseUsers() {
  metrics.increment("airtable.get_firstpurchaseusers");
  const tsStart = performance.now();

  // Return all users for which the Orders field has a length of 1, and the firstPurchaseSubmitted field is false
  const data = await hoursAirtable
    .select({
      filterByFormula: `AND({Order Count} = 1, NOT({firstPurchaseSubmitted}))`,
      // filterByFormula: `{Order Count} = 1`,
    })
    .all();

  console.log("LOGGING DATA");
  // console.log(data);
  // if (data) {
  //   console.log(data[0]["fields"]);
  // }

  metrics.timing(
    "airtable.get_firstpurchaseusers",
    performance.now() - tsStart
  );
  return data;
}
