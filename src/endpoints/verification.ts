import { Request, Response } from "express";
import { getVerifiedEmails } from "../functions/airtable";

export async function verification(req: Request, res: Response) {
  let body = req.body;
  let headers = req.headers;

  let verifiedUsersEmails = await getVerifiedEmails();

  // destructure the body to get email
  let { email } = body;

  // destructure the headers to get the authorization token
  let { authorization } = headers;

  if (authorization !== `Bearer ${process.env.TrashPandaSecret}`) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    if (email) {
      res.status(400).send({ message: "Email is required" });
      return;
    } else {
      if (verifiedUsersEmails.includes(email)) {
        res.status(200).send({ verified: true });
      } else {
        res.status(200).send({ verified: false });
      }
    }
  }
}
