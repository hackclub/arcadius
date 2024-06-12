import Airtable from "airtable";
import { Request, Response } from "express";

export async function verification(req: Request, res: Response) {
  let body = req.body;
  let headers = req.headers;

  const verificationsAirtable = new Airtable({
    apiKey: process.env.AIRTABLE_KEY,
  }).base("app4kCWulfB02bV8Q")("Verifications");

  let verifiedUsers = await verificationsAirtable;
  let verifiedUsersArray = await verifiedUsers
    .select({
      filterByFormula: `{Verified} = TRUE()`,
      fields: ["Email"],
    })
    .all();

  let verifiedUsersEmails = verifiedUsersArray.map((record) => {
    return record.get("Email");
  });

  // destructure the body to get email
  let { email } = body;

  // destructure the headers to get the authorization token
  let { authorization } = headers;

  if (authorization !== `Bearer ${process.env.EightBitSecret}`) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    if (verifiedUsersEmails.includes(email)) {
      res.status(200).send({ verified: true });
    } else {
      res.status(200).send({ verified: false });
    }
  }
}
