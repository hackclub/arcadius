import Airtable from "airtable";

const hoursAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("app4kCWulfB02bV8Q")("Users");

const verificationsAirtable = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("appre1xwKlj49p0d4")("Users");

async function getVerifiedEmails() {
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

  return verifiedUsersEmails;
}

async function getHoursUsers() {
  let users = await hoursAirtable
    .select({
      // fields: ["Name", "Hack Hour ID", "Slack ID", "Email", "Minutes "]
    })
    .all();

  // make an array of users, where each user is an object with the fields as keys
  let usersMap = await users.map((record) => {
    return record.fields;
  });

  return usersMap;
}

async function getVerificationsUsers() {
  let users = await verificationsAirtable.select({}).all();

  // make an array of users, where each user is an object with the fields as keys
  let usersMap = await users.map((record) => {
    return record.fields;
  });
  return usersMap;
}

async function getVerifiedUsers() {
  return await getVerificationsUsers().then((users) => {
    let verifiedUsers = users.filter(
      (user) => user["Eligible L1"] === true || user["Eligible L2"] === true
    );
    return verifiedUsers;
  });
}

export {
  getHoursUsers,
  getVerificationsUsers,
  getVerifiedEmails,
  getVerifiedUsers,
  hoursAirtable,
  verificationsAirtable,
};
