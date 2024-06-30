import { client } from "../../index";
import { hoursAirtable } from "../../lib/airtable";
import { blog } from "../../util/Logger";
import { sendUpgradedDM } from "../slack/sendStuff";
import { gameOver } from "../slack/slackPromoDemo";

export async function pollVerifications() {
  try {
    blog("Polling User Verifications", "info");

    const data = await hoursAirtable.select().all();

    // game over : C07ABG7JW69

    // loop through the records
    data.forEach(async (record) => {
      if (
        record.get("Verification Status (from YSWS Verification User)") ===
          "Eligible L1" ||
        record.get("Verification Status (from YSWS Verification User)") ===
          "Eligible L2"
      ) {
        if (record.get("finalDm") === true) {
          return;
        } else {
          // if they don't, send the final DM
          sendUpgradedDM(record.get("Slack ID"));
          // set the finalDm field to true
          await hoursAirtable.update(record.id, {
            finalDm: true,
          });
        }
      }

      if (
        record.get("Verification Status (from YSWS Verification User)") ===
        "Not Eligible"
      ) {
        await gameOver(record.get("Slack ID"));

        // send the user a dm saying they are not eligible
        let dmchannel = record.get("dmChannel");

        // send the user a dm saying they are not eligible
        client.chat.postMessage({
          channel: dmchannel,
          text: `Hey there! It looks like you are not eligible for the Hack Club's Arcade. If you have any questions, please reach out to us via email at arcade@hackclub.com.`,
        });

        // todo: add an indicator to show if this was sent in airtable
      }

      if (record.get("Fraud") === "🚩 Committed Fraud") {
        await gameOver(record.get("Slack ID"));

        let dmchannel = record.get("dmChannel");

        // send the user a dm
        client.chat.postMessage({
          channel: dmchannel,
          text: `Hey. Unfortunately, it we've flagged your arcade hours as fraudulent, and thus we've had to remove you from the arcade. If you have any questions, please reach out to us via email at arcade@hackclub.com.`,
        });

        // todo: add an indicator to show if this was sent in airtable
      }
    });
  } catch (error) {
    blog(`Error in pollVerifications: ${error}`, "error");
  }
}
