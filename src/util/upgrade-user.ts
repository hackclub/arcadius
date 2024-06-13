import axios from "axios";
import { client } from "../index";

export async function upgradeUser(user) {
  const userProfile = await client.users.info({ user });
  const { team_id } = userProfile.user;

  if (
    !userProfile.user.is_restricted &&
    !userProfile.user.is_ultra_restricted
  ) {
    console.log(`User ${user} is already a full user– skipping`);
    return null;
  }

  console.log(`Attempting to upgrade user ${user}`);
  const cookieValue = `d=${process.env.SLACK_COOKIE}`;

  const form = JSON.stringify({
    user,
    team_id,
  });

  return await axios({
    method: "POST",
    url: `https://slack.com/api/users.admin.setRegular?slack_route=${team_id}&user=${user}`,
    headers: {
      Cookie: cookieValue,
      "Content-Type": "application/json",
      "User-Agent": "jasper@hackclub.com",
      Authorization: `Bearer ${process.env.SLACK_BROWSER_TOKEN}`,
    },
    data: form,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
