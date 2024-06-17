import metrics from "../../metrics";
import { blog } from "../../util/Logger";

export const fetchUsers = async (email) => {
  try {
    blog(`fetchUsers: email: ${email}`, "info");

    const cookieValue = `d=${process.env.JM_SLACK_COOKIE}`;

    metrics.increment("http.request.api_users-admin-fetchTeamUsers.200");
    const startTs = performance.now();

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
          cookie: cookieValue,
        },
        referrerPolicy: "no-referrer",
        body: `------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="token"\r\n\r\n${process.env.ARCADIUS_SLACK_BROWSER_TOKEN}\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="count"\r\n\r\n100\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="include_bots"\r\n\r\n0\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="exclude_slackbot"\r\n\r\ntrue\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="include_deleted"\r\n\r\n0\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="sort_dir"\r\n\r\nasc\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="sort"\r\n\r\nreal_name\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="target_team"\r\n\r\nT0266FRGM\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="query"\r\n\r\n{"type":"and","clauses":[{"type":"is","value":"user"},{"type":"and","clauses":[{"type":"or","clauses":[{"type":"level","value":"owner"},{"type":"level","value":"primary_owner"},{"type":"level","value":"admin"},{"type":"level","value":"regular"}]},{"type":"or","clauses":[{"type":"inactive","value":false}]}]},{"type":"fuzzy_with_email","value":"me@jaspermayone.com"}]}\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="_x_reason"\r\n\r\nworkspace-members-tab-fetch-members-and-idp-groups\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1\r\nContent-Disposition: form-data; name="_x_mode"\r\n\r\nonline\r\n------WebKitFormBoundarycYnHmVvk1fF1ddL1--\r\n`,
        method: "POST",
      }
    );

    const response = await a.json();

    metrics.timing(
      "http.request.api_users-admin-fetchTeamUsers",
      performance.now() - startTs
    );
    return response.items?.[0]?.email;
  } catch (error) {
    metrics.increment("http.request.api_users-admin-fetchTeamUsers.500");
    blog(`Error in fetchUsers: ${error}`, "error");
  }
};
