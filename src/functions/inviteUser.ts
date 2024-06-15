import colors from "colors";
import metrics from "../metrics";
import { slog } from "../util/Logger";

async function inviteGuestToSlack({ email, channels }) {
  metrics.increment("http.request.api_users-admin-inviteGuestToSlack");
  const startTs = performance.now();

  slog(`Inviting ${email} to Slack...` , "info");

  const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN!;
  const xoxd = process.env.ARCADIUS_SLACK_COOKIE!;

  let result;
  // try {
  //   const res = await fetch(
  //     "https://hackclub.slack.com/api/users.admin.inviteBulk?_x_id=b0f5404e-1718353823.874&_x_csid=IEsVHGOxDp4&slack_route=T0266FRGM&_x_version_ts=1718329055&_x_frontend_build_type=current&_x_desktop_ia=4&_x_gantry=true&fp=51&_x_num_retries=0",
  //     {
  //       headers: {
  //         accept: "*/*",
  //         "accept-language": "en-US,en;q=0.9",
  //         "content-type":
  //           "multipart/form-data; boundary=----WebKitFormBoundarywU8f2SN7x203nBgg",
  //         priority: "u=1, i",
  //         "sec-ch-ua":
  //           '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  //         "sec-ch-ua-mobile": "?0",
  //         "sec-ch-ua-platform": '"macOS"',
  //         "sec-fetch-dest": "empty",
  //         "sec-fetch-mode": "cors",
  //         "sec-fetch-site": "same-site",
  //         cookie: `_ga=GA1.3.1162602351.1711662493; __pdst=f4b5ac27b8a549fda454ff87ce21e5d1; _rdt_uuid=1718332189154.b4d8268c-8e7a-4760-8d6e-2fba9398fa3a; cjConsent=MHxOfDB8Tnww; cjUser=2ba9f599-c324-49e9-9cd4-8a5a6299e684; cjLiveRampLastCall=2024-06-14T02:31:17.478Z; _cs_c=0; _cs_id=a8901888-fabc-a5fd-e1b2-02754272782b.1711662493.3.1718332277.1718332277.1.1745826493290.1; _gcl_au=1.1.776662237.1718332279; _gid=GA1.2.1223650801.1718332279; _ga=GA1.1.1560491026.1718332279; ec=enQtNzI2ODQ1MjYwNTY1NC1mNDJhZDU1ZmVjMTAyZDZkZTY1MThjMTk5ZGNkODlkMTZkOWJhODNkZDA4ODYwMzFkYjIyZTljNjE4OTI2YWNh; _ga_QTJQME5M5D=GS1.1.1718332277.1.0.1718332289.48.0.0; b=.35d9d4356e3690db33c580f9ffd13e72; tz=-240; web_cache_last_updated2fea7264994cc616b27cf2ef8a2e8815=1718332308746; lc=1718335662; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+13+2024+23%3A30%3A22+GMT-0400+(Eastern+Daylight+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=fa630ea4-942f-4fa8-b4b2-8ced6f5706ea&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=1%3A1%2C3%3A1%2C2%3A1%2C4%3A1&AwaitingReconsent=false; shown_ssb_redirect_page=1; d-s=1718353740; x=35d9d4356e3690db33c580f9ffd13e72.1718353740; d=${xoxd}; web_cache_last_updated54f9ba96a3f4993ade3482d6d53afcc2=1718353746417`,
  //       },
  //       referrerPolicy: "no-referrer",
  //       body: `------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${xoxc}\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"invites\"\r\n\r\n[{\"email\":\"${email}\",\"type\":\"restricted\",\"mode\":\"manual\"}]\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"source\"\r\n\r\ninvite_modal\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"campaign\"\r\n\r\nteam_menu\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"mode\"\r\n\r\nmanual\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"restricted\"\r\n\r\ntrue\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"ultra_restricted\"\r\n\r\nfalse\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"email_password_policy_enabled\"\r\n\r\nfalse\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"team_id\"\r\n\r\nT0266FRGM\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"channels\"\r\n\r\n${csvChannels}\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"_x_reason\"\r\n\r\ninvite_bulk\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"_x_mode\"\r\n\r\nonline\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"_x_sonic\"\r\n\r\ntrue\r\n------WebKitFormBoundarywU8f2SN7x203nBgg\r\nContent-Disposition: form-data; name=\"_x_app_name\"\r\n\r\nclient\r\n------WebKitFormBoundarywU8f2SN7x203nBgg--\r\n`,
  //       method: "POST",
  //     }
  //   );
  //   const data = await res.json();
  //   console.log(data);
  //   result = data.ok;
  // } catch (e) {
  //   logger(`Error inviting user ${email} to Slack: ${e}`, "error");
  //   result = false;
  // } finally {
  //   if (result) {
  //     metrics.timing(
  //       "http.requests.api_users-admin-inviteGuestToSlack.200",
  //       performance.now() - startTs
  //     );
  //   } else {
  //     metrics.timing(
  //       "http.requests.api_users-admin-inviteGuestToSlack.400",
  //       performance.now() - startTs
  //     );
  //   }
  //   return result;
  // }
}

let channels = [
  "C01504DCLVD", // #scrapbook
  "C077TSWKER0", // #arcade-help
  "C06SBHMQU8G", // #hack-hour
  // "C078CMYMW4R", // #arcade-lounge
];

let csvChannels = channels.join(",");

export async function inviteSlackUser({ email }) {
  console.log(colors.red.dim(`Inviting ${email} to Slack...`));
  return await inviteGuestToSlack({ email, channels }).then(() => {
    console.log(colors.green.dim(`Invited ${email} to Slack!`));
    slog(`Invited ${email} to Slack!`, "info");
    return { ok: true };
  });
}
