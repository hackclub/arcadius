import Airtable from "airtable";
import metrics from "../metrics";

const hoursAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("app4kCWulfB02bV8Q")("Users");

const sessionsAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("app4kCWulfB02bV8Q")("Sessions");

const ordersAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("app4kCWulfB02bV8Q")("Sessions");

const verificationsAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("appre1xwKlj49p0d4")("Users");

const slackJoinsAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("appaqcJtn33vb59Au")("Arcade Joins");

// TODO !~ This needs doing!
// const purchasesAirtable = new Airtable({})

export async function getVerifiedEmails() {
  metrics.increment("airtable.get_verifiedemails");
  const tsStart = performance.now();

  let verifiedUsers = await verificationsAirtable;
  let verifiedUsersArray = await verifiedUsers
    .select({
      filterByFormula: `{Verified} = TRUE()`,
      fields: ["Email"],
    })
    .all();

  let verifiedUsersEmails = await verifiedUsersArray.map((record) => {
    return record.get("Email");
  });

  metrics.timing("airtable.get_verifiedemails", performance.now() - tsStart);
  return verifiedUsersEmails;
}

export async function getHoursUsers() {
  metrics.increment("airtable.get_hoursusers");
  const tsStart = performance.now();

  let users = await hoursAirtable
    .select({
      // fields: ["Name", "Internal ID", "Slack ID", "Email", "Minutes "]
    })
    .all();

  // make an array of users, where each user is an object with the fields as keys
  let usersMap = await users.map((record) => {
    return record.fields;
  });

  metrics.timing("airtable.get_hoursusers", performance.now() - tsStart);
  return usersMap;
}

export async function getVerificationsUsers() {
  metrics.increment("airtable.get_verificationusers");
  const tsStart = performance.now();

  let users = await verificationsAirtable
    .select({
      // fields: ["Name", "Internal ID", "Slack ID", "Email", "Minutes "]
    })
    .all();

  let usersMap = await users.map((record) => {
    return record.fields;
  });

  metrics.timing("airtable.get_verificationusers", performance.now() - tsStart);
  return usersMap;
}

export async function getVerifiedUsers() {
  metrics.increment("airtable.get_verifiedusers");
  const tsStart = performance.now();

  const data = await getVerificationsUsers().then((users) => {
    let verifiedUsers = users.filter(
      (user) =>
        user["Verification Status"] === "Eligible L1" ||
        user["Verification Status"] === "Eligible L2"
    );
    return verifiedUsers;
  });

  metrics.timing("airtable.get_verifiedusers", performance.now() - tsStart);
  return data;
}

// Check for any users that need to be invited but have not been due to an apparent fault in the system.
// Only trigger for users that have joined on or after June 12th, 2024
export async function getInvitationFaults() {
  metrics.increment("airtable.get_invitationfaults");
  const tsStart = performance.now();

  const data = await slackJoinsAirtable
    .select({
      filterByFormula: `NOT({Invited})`,
    })
    .all();

  metrics.timing("airtable.get_invitationfaults", performance.now() - tsStart);
  return data;
}

// Get all users that have just made their first purchase
export async function getFirstPurchaseUsers() {
  metrics.increment("airtable.get_firstpurchaseusers");
  const tsStart = performance.now();

  // Return all users for which the Orders field has a length of 1, and the firstPurchaseSubmitted field is false
  const data = await verificationsAirtable
    .select({
      // filterByFormula: `AND(LEN({Orders}) = 1, NOT({firstPurchaseSubmitted}))`,
    })
    .all();

  metrics.timing(
    "airtable.get_firstpurchaseusers",
    performance.now() - tsStart
  );
  return data;
}

// Get all users where {Minutes (Approved)} is greater than 180
export async function getMinimumHoursConfirmedUsers() {
  metrics.increment("airtable.get_minimumhoursconfirmedusers");
  const tsStart = performance.now();

  const data = await hoursAirtable
    .select({
      // filterByFormula: `AND({Minutes (Approved)} > 180, NOT({minimumHoursConfirmed}))`,
    })
    .all();

  metrics.timing(
    "airtable.get_minimumhoursconfirmedusers",
    performance.now() - tsStart
  );
  return data;
}

export {
  hoursAirtable,
  ordersAirtable,
  sessionsAirtable,
  slackJoinsAirtable,
  verificationsAirtable,
};
