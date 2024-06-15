import logger from "../../util/Logger";
import { getInvitationFaults } from "../airtable/getInvitationFaults";


export async function pollInvitationFaults() {
  try {
    const uninvitedUsers = await getInvitationFaults();

    uninvitedUsers
      .map((record) => record)
      .forEach((record) => {
        let email = record.fields["Email"];

        // inviteSlackUser({ email }).then((v) => {
        //   if (v) slackJoinsAirtable.update(record.id, { Invited: true });
        // });
      });
  } catch (err) {
    logger(`Error polling invitation faults: ${err}`, "error");
  }
}
