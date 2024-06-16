import * as dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";

import metrics from "../metrics";
import logger, { slog } from "../util/Logger";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});
const client = app.client;

export async function upgradeSlackUser(client, slackId) {
  metrics.increment("slack.upgradeUser");
  const tsStart = performance.now();

  const xoxc = process.env.ARCADIUS_SLACK_BROWSER_TOKEN;
  const user = slackId;
  const xoxd = process.env.ARCADIUS_SLACK_COOKIE;

  // slog(`Upgrading user ${user}`);

  try {
    await fetch(
      "https://hackclub.slack.com/api/users.admin.setRegular?_x_id=4bb6e5fd-1718545234.666&slack_route=T0266FRGM&_x_version_ts=noversion&fp=51&_x_num_retries=0",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundaryboeJVcFkGB66J42M",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: `x=d5a2b51d82f5b360269ee5e2a87605df.1718544400; _cs_mk_ga=0.3030069135578226_1718545058410; _li_dcdm_c=.slack.com; _lc2_fpi=e00b11ac9c9b--01j0gm92t9gs7d116ygegc1azz; _lc2_fpi_meta={%22w%22:1718545058633}; _rdt_uuid=1718545058712.086c39a1-c00f-430d-885b-fb82b29291be; cjConsent=MHxOfDB8Tnww; cjUser=dc50a529-3ddc-4835-a1e0-a2c00382b44a; cjLiveRampLastCall=2024-06-16T13:37:38.736Z; _cs_c=0; _cs_cvars=%7B%221%22%3A%5B%22Visitor%20ID%22%2C%22d5a2b51d82f5b360269ee5e2a87605df%22%5D%2C%223%22%3A%5B%22URL%20Path%22%2C%22%2Fsignin%22%5D%2C%224%22%3A%5B%22Visitor%20Type%22%2C%22prospect%22%5D%7D; _cs_id=0a96cd30-ea3e-a624-d769-356f256f0798.1718545058.1.1718545058.1718545058.1.1752709058879.1; __adroll_fpc=c6b9143fb91187b25d1920d10acdd7ed-1718545058920; __ar_v4=; __qca=P0-985955095-1718545058623; _cs_s=1.5.0.1718546859129; _li_ss=Cg8KBgiiARCWGAoFCAoQlhgSLw2IX_ESEigKBgjKARCWGAoGCJMBEJQYCgYIlAEQlBgKBgjGARCVGAoGCKsBEJQY; _li_ss_meta={%22w%22:1718545059340%2C%22e%22:1721137059340}; _gcl_au=1.1.187455105.1718545060; _gid=GA1.2.795455300.1718545060; _ga=GA1.1.779475615.1718545060; ec=enQtNzI4NjA4Nzg5MDU2NC1kNmNkZjAxODdhNTQwOWNiMTZjN2IzMzkwM2ZhNTFlNjlkYmY2OGZiZDBjYmI3MjkwMmRkMTA1N2Q2ZGRmYzQ3; _ga_QTJQME5M5D=GS1.1.1718545058.1.0.1718545068.50.0.0; lc=1718545075; d-s=1718545075; b=.d5a2b51d82f5b360269ee5e2a87605df; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Jun+16+2024+09%3A37%3A56+GMT-0400+(Eastern+Daylight+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=c54c5cab-e398-439e-8152-f2fd453aed8c&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=1%3A1%2C3%3A1%2C2%3A1%2C4%3A1&AwaitingReconsent=false; shown_ssb_redirect_page=1; shown_download_ssb_modal=1; show_download_ssb_banner=1; no_download_ssb_banner=1; d=${xoxd}; tz=-240; web_cache_last_updated7a7cdf8f7c6437e6c81ce11bbb9a5958=1718545084125`,
        },
        referrerPolicy: "no-referrer",
        body: `------WebKitFormBoundaryboeJVcFkGB66J42M\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${xoxc}\r\n------WebKitFormBoundaryboeJVcFkGB66J42M\r\nContent-Disposition: form-data; name=\"user\"\r\n\r\nU077HDMHF8E\r\n------WebKitFormBoundaryboeJVcFkGB66J42M\r\nContent-Disposition: form-data; name=\"_x_reason\"\r\n\r\nadminMembersStore_makeRegular\r\n------WebKitFormBoundaryboeJVcFkGB66J42M\r\nContent-Disposition: form-data; name=\"_x_mode\"\r\n\r\nonline\r\n------WebKitFormBoundaryboeJVcFkGB66J42M--\r\n`,
        method: "POST",
      }
    ).then((r) => {
      if (r.ok) {
        metrics.timing("slack.upgradeUser.200", performance.now() - tsStart);
        slog(`User ${user} upgraded`, "info");
      } else {
        metrics.timing("slack.upgradeUser.400", performance.now() - tsStart);
        slog(`Error upgrading user ${user}`, "error");
      }
    });
  } catch (e) {
    logger(`Error upgrading user ${e}`, "error");
    slog(`Error upgrading user ${e}`, "error");
  }
}
