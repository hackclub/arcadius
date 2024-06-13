import axios from "axios";

async function inviteGuestToSlack({ email, channels }) {
  const cookieValue = `d=${process.env.ARCADIUS_SLACK_COOKIE}`;

  const data = JSON.stringify({
    token: process.env.ARCADIUS_SLACK_BROWSER_TOKEN,
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
    url: `https://slack.com/api/users.admin.inviteBulk`,
    headers: {
      Cookie: cookieValue,
      "User-Agent": "jasper@hackclub.com",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ARCADIUS_SLACK_BROWSER_TOKEN}`,
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
  "C077TSWKER0", // #arcade-help
  "C06SBHMQU8G", // #hack-hour
  // "C078CMYMW4R", // #arcade-lounge
];

export async function inviteUser({ email }) {
  console.log(
    "calling inviteGuestToSlack with email",
    email,
    "and channels",
    channels
  );
  return await inviteGuestToSlack({ email, channels });
}
