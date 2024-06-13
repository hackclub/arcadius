export async function upgradeUser(client, slackId) {
  const userProfile = await client.users.info({ slackId });
  // const { team_id } = userProfile.user;

  if (
    !userProfile.user.is_restricted &&
    !userProfile.user.is_ultra_restricted
  ) {
    console.log(`User with ID ${slackId} is already a full user– skipping`);
    return null;
  }

  console.log(`Attempting to upgrade user with ID ${slackId}`);
  try {
    let fetchy = await fetch(
      "https://hackclub.slack.com/api/users.admin.setRegular?_x_id=50890ded-1718314762.469&slack_route=T0266FRGM&_x_version_ts=noversion&fp=51&_x_num_retries=0",
      {
        headers: {
          "User-Agent": "jasper@hackclub.com",
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundaryV4PLP54vRY12ENhc",
          priority: "u=1, i",
          "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: `d-s=1712278403; b=.f8832824fcb2757edf9a5a7004dda8ff; shown_ssb_redirect_page=1; shown_download_ssb_modal=1; show_download_ssb_banner=1; no_download_ssb_banner=1; tz=-240; ssb_instance_id=23258371-ac3b-4ebf-93b4-695ab7482ae0; __zlcmid=1LymkajVZbCkmD8; x=f8832824fcb2757edf9a5a7004dda8ff.1718313793; ec=enQtNzI3MTIxNzM2MDk0OS03MTUxZDU2MjAzY2NjODQ2MDBhMTM2NDY0ZDBiMjljY2JiNTJiYWNmZDExMjdjN2QxYmNiYTJmNDI0OGQ5Mzcy; lc=1718313831; d=${process.env.ARCADIUS_SLACK_COOKIE}; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+13+2024+17%3A34%3A27+GMT-0400+(Eastern+Daylight+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=78d80595-4bbb-443c-9d71-a7f794b693b2&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=1%3A1%2C3%3A1%2C2%3A1%2C4%3A0&AwaitingReconsent=false`,
        },
        referrerPolicy: "no-referrer",
        body: `------WebKitFormBoundaryV4PLP54vRY12ENhc\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${process.env.ARCADIUS_SLACK_BROWSER_TOKEN}\r\n------WebKitFormBoundaryV4PLP54vRY12ENhc\r\nContent-Disposition: form-data; name=\"user\"\r\n\r\n${slackId}\r\n------WebKitFormBoundaryV4PLP54vRY12ENhc\r\nContent-Disposition: form-data; name=\"_x_reason\"\r\n\r\nadminMembersStore_makeRegular\r\n------WebKitFormBoundaryV4PLP54vRY12ENhc\r\nContent-Disposition: form-data; name=\"_x_mode\"\r\n\r\nonline\r\n------WebKitFormBoundaryV4PLP54vRY12ENhc--\r\n`,
        method: "POST",
      }
    ).then((response) => response.json());
    console.log(fetchy);
  } catch (e) {
    console.log(e);
  }

  // return await axios({
  //   method: "POST",
  //   url: `https://slack.com/api/users.admin.setRegular?slack_route=${team_id}&user=${user}`,
  //   headers: {
  //     Cookie: cookieValue,
  //     "Content-Type": "application/json",
  //     "User-Agent": "jasper@hackclub.com",
  //     Authorization: `Bearer ${process.env.ARCADIUS_SLACK_BROWSER_TOKEN}`,
  //   },
  //   data: form,
  // })
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}
