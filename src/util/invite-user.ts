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

  return await axios({
    method: "POST",
    url: `https://slack.com/api/users.admin.invite`,
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
    .catch((error) => {
      console.log(error);
    });
}

let channels = [
  "C01504DCLVD", // #scrapbook
  "C06U5U9ADGD", // #power-hour-bts
  "C06SBHMQU8G", // #hack-hour
];

async function inviteUser({ email }) {
  return await inviteGuestToSlack({ email, channels });
}

module.exports = { inviteUser };
