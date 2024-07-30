// import colors from "colors";
// import metrics from "../../metrics";
// import { blog } from "../../util/Logger";
const blog = console.log;

async function inviteGuestToSlack({ email, channels }) {
  try {
    // metrics.increment("http.request.api_users-admin-inviteGuestToSlack");
    const startTs = performance.now();

    blog(`Inviting ${email} to Slack...`, "info");

    const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN!;
    const xoxd = process.env.ARCADIUS_SLACK_COOKIE!;

    const payload = `
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="token"

${xoxc}
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="invites"

[{"email":"${email}","type":"restricted","mode":"manual"}]
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="source"

invite_modal
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="campaign"

team_site_admin
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="mode"

manual
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="restricted"

true
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="ultra_restricted"

false
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="team_id"

T0266FRGM
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
Content-Disposition: form-data; name="channels"

${channels}
------WebKitFormBoundaryUFhJFSnW5IIfR4IZ
`;
    let result;
    try {
      const data = await fetch(
        "https://hackclub.slack.com/api/users.admin.inviteBulk",
        {
          headers: {
            "content-type":
              "multipart/form-data; boundary=----WebKitFormBoundaryUFhJFSnW5IIfR4IZ",
            cookie: `d=${xoxd};`,
          },
          body: payload,
          method: "POST",
        }
      ).then((response) => response.json());
      console.log({ slack: data })

      result = data.ok;
    } catch (e) {
      blog(`Error inviting user ${email} to Slack: ${e}`, "error");
      result = false;
    } finally {
      if (result) {
        // metrics.timing(
        //   "http.requests.api_users-admin-inviteGuestToSlack.200",
        //   performance.now() - startTs
        // );
      } else {
        // metrics.timing(
        //   "http.requests.api_users-admin-inviteGuestToSlack.400",
        //   performance.now() - startTs
        // );
      }
      return result;
    }
  } catch (error) {
    blog(`Error in inviteGuestToSlack: ${error}`, "error");
    // metrics.increment("http.request.api_users-admin-inviteGuestToSlack.error");
  }
}

let channels = [
  "C06SBHMQU8G", // #arcade
  "C077TSWKER0", // #arcade-help
  "C07897CNC4D", // #arcade-lounge
  "C07AXU6FCC8", // #arcade-bulletin
  "C01504DCLVD", // #scrapbook
  "C07AQ75CWQJ", // #arcade-shoutouts
];

let csvChannels = channels.join(",");

export async function inviteSlackUser({ email }) {
  try {
    console.log(`Inviting ${email} to Slack...`);
    return await inviteGuestToSlack({ email, channels }).then(() => {
      console.log(`Invited ${email} to Slack!`);
      blog(`Invited ${email} to Slack!`, "info");
      return { ok: true };
    });
  } catch (e) {
    blog(`Error in inviteSlackUser: ${e}`, "error");
    return { ok: false, error: e };
  }
}

inviteGuestToSlack({ email: "a6ve50@hack.af", channels: csvChannels });
