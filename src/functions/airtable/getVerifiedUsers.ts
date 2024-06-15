import metrics from "../../metrics";
import { getVerificationsUsers } from "./getVerificationsUsers";


export async function getVerifiedUsers() {
  metrics.increment("airtable.get_verifiedusers");
  const tsStart = performance.now();

  const data = await getVerificationsUsers().then((users) => {
    let verifiedUsers = users.filter(
      (user) => user["Verification Status"] === "Eligible L1" ||
        user["Verification Status"] === "Eligible L2"
    );
    return verifiedUsers;
  });

  metrics.timing("airtable.get_verifiedusers", performance.now() - tsStart);
  return data;
}
