import metrics from "../../metrics";
import logger, { blog } from "../../util/Logger";
import { getInvitationFaults } from "../airtable/getInvitationFaults";

export async function pollInvitationFaults() {
    try {
        metrics.increment("airtable.poll_invitationfaults.200");
        blog("Polling invitation faults", "info");

        const uninvitedUsers = await getInvitationFaults();

        if (!uninvitedUsers) {
            logger("No uninvited users found.", "info");
            return;
        }

        uninvitedUsers
            .map((record) => record)
            .forEach((record) => {
                let email = record.fields["Email"];

                // inviteSlackUser({ email }).then((v) => {
                //   if (v) slackJoinsAirtable.update(record.id, { Invited: true });
                // });
            });
    } catch (err) {
        blog(`Error polling invitation faults: ${err}`, "error");
        metrics.increment("airtable.poll_invitationfaults.500");
    }
}
