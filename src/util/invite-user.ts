import axios from "axios";

async function inviteGuestToSlack({ email, channels }) {
  const cookieValue = `d=${process.env.SLACK_COOKIE}`;

  const data = JSON.stringify({
    token: process.env.SLACK_BROWSER_TOKEN,
    invites: [
      {
        email,
        type: "restricted",
        mode: "manual",
      },
    ],
    restricted: true,
    channels: channels.join(","),
  });

  return axios({
    method: "POST",
    url: `https://slack.com/api/users.admin.inviteBulk`,
    headers: {
      Cookie: cookieValue,
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLACK_BROWSER_TOKEN}`,
    },
    data,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {});
}

export async function inviteUser({ email }) {
  const channels = ["C06T7A8E3", "C06SBHMQU8G", "C06U5U9ADGD"];

  return await inviteGuestToSlack({ email, channels });
}
