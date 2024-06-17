import { hoursAirtable } from "../../lib/airtable";
import metrics from "../../metrics";
import { blog } from "../../util/Logger";
import { getHoursUsers } from "../airtable/getHoursUsers";
import { getVerifiedUsers } from "../airtable/getVerifiedUsers";
import { sendAlreadyVerifiedDM } from "../slack/sendStuff";

export async function checkUserHours() {
  try {
    metrics.increment("airtable.check_userhours");
    const tsStart = performance.now();

    blog("Checking user hours", "info");

    let USERS = await getHoursUsers();

    if (!USERS || USERS.length === 0) {
      blog("No users found in Airtable", "info");
      return;
    }

    let usersWithMoreThanNoMinutes = USERS.filter((user) => {
      let minutesAll = Number(user["Minutes (All)"] ?? 0);
      return minutesAll > 0;
    });

    let usersWithAtLeastOneSession = USERS.filter((user) => {
      // check where user[sessions] > 0
      // check to see if sessions is not any empty array
      if (user["Sessions"] === undefined) {
      } else {
        return user;
      }
    });

    let tmp = await getVerifiedUsers();

    if (!tmp || tmp.length === 0) {
      blog("No verified users found in Airtable", "info");
      return;
    }

    // make an array of 'Hack Club Slack ID's
    let verifiedUsers = tmp.map((user) => user["Hack Club Slack ID"]);

    // check if the user has minimumHoursConfirmed === true
    // if not, send them a DM
    usersWithAtLeastOneSession.forEach(async (user) => {
      if (user["verificationDmSent"] === true && user["isFullUser"] === true) {
        return;
      } else {
        if (user["isFullUser"] === true) {
          return;
        } else {
          if (user["verificationDmSent"] !== true) {
            if (
              verifiedUsers.includes(user["Slack ID"]) &&
              user["verificationDmSent"]
            ) {
              await sendAlreadyVerifiedDM(user["Slack ID"]).then(() => {
                // upgradeSlackUser(client, user["Slack ID"]);
              });
            } else {
              await sendAlreadyVerifiedDM(user["Slack ID"]);
            }

            try {
              const userRec = await hoursAirtable
                .select({
                  filterByFormula: `{Slack ID} = '${user["Slack ID"]}'`,
                  pageSize: 1,
                })
                .firstPage();

              await hoursAirtable.update(userRec[0].id, {
                verificationDmSent: true,
              });
            } catch (err) {
              blog(`Error updating user: ${err}`, "error");
            }
          } else {
            return;
          }
        }
      }
    });
  } catch (error) {
    blog(`Error in checkUserHours: ${error}`, "error");
    metrics.increment("airtable.check_userhours.error");
  }
}
