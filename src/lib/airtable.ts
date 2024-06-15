import Airtable from "airtable";

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

export {
  hoursAirtable,
  ordersAirtable,
  sessionsAirtable,
  slackJoinsAirtable,
  verificationsAirtable
};
