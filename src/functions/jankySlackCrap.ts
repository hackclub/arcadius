export const fetchUsers = async (email) => {
  const cookieValue = `d=${process.env.SLACK_COOKIE}`;

  const a = await fetch(
    "https://hackclub.slack.com/api/users.admin.fetchTeamUsers?_x_id=3592b959-1718245056.144&slack_route=T0266FRGM&_x_version_ts=noversion&fp=51&_x_num_retries=0",
    {
      headers: {
        "User-Agent": "jasper@hacklub.com",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundarycYnHmVvk1fF1ddL1",
        priority: "u=1, i",
        "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "d-s=1712278403; b=.f8832824fcb2757edf9a5a7004dda8ff; shown_ssb_redirect_page=1; shown_download_ssb_modal=1; show_download_ssb_banner=1; no_download_ssb_banner=1; tz=-240; ssb_instance_id=23258371-ac3b-4ebf-93b4-695ab7482ae0; __zlcmid=1LymkajVZbCkmD8; ec=enQtNzI2MjI4NDM2Nzg0Mi04YmQ5YmYxZDg5OGU2ZTU3Y2E5NGMyZDJlZDM3NzFjM2M2Mjg4MWFlNGYxMDAzYTc5NGNkZjY0ZmI0Mzc1NDBl; lc=1718173826; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jun+12+2024+21%3A12%3A30+GMT-0400+(Eastern+Daylight+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=78d80595-4bbb-443c-9d71-a7f794b693b2&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=1%3A1%2C3%3A1%2C2%3A1%2C4%3A0&AwaitingReconsent=false; d=xoxd-NvKMFKMB2Fcz6eP1uj2WAvmFpNCUAL75OGJZp%2BrZ4cV9NVtWilgzQry6kxGQYzHn06PAqAKHXR7aRW0Ey4WlCAGMGYgJkDQ2E86x1dItRXfbu%2FIxC9VVx5Tx1X8KwVdM4QB9FVbDwYu%2BKxPnYknBnzt6DtDiXAXf2af%2B72DDM%2Bn2QOYDKUE4XumXrZUJVJ0HClhjB0g%3D",
      },
      referrerPolicy: "no-referrer",
      body: '------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="token"\r\n\r\nxoxc-2210535565-5779144564129-7262175621299-bfd1491d23daee7c2d64eebdbb0e09634515b0bbcd4094091638ec46e547a1fe\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="count"\r\n\r\n100\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="include_bots"\r\n\r\n0\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="exclude_slackbot"\r\n\r\ntrue\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="include_deleted"\r\n\r\n0\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="sort_dir"\r\n\r\nasc\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="sort"\r\n\r\nreal_name\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="target_team"\r\n\r\nT0266FRGM\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="query"\r\n\r\n{"type":"and","clauses":[{"type":"is","value":"user"},{"type":"and","clauses":[{"type":"or","clauses":[{"type":"level","value":"owner"},{"type":"level","value":"primary_owner"},{"type":"level","value":"admin"},{"type":"level","value":"regular"}]},{"type":"or","clauses":[{"type":"inactive","value":false}]}]},{"type":"fuzzy_with_email","value":"me@jaspermayone.com"}]}\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="_x_reason"\r\n\r\nworkspace-members-tab-fetch-members-and-idp-groups\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="_x_mode"\r\n\r\nonline\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1--\r\n',
      method: "POST",
    }
  );

  const response = await a.json();

  return response.items?.[0]?.email;
};
