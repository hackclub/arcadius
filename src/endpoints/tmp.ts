import { Request, Response } from "express";
import { client } from "../index";
import { upgradeUser } from "../util/upgrade-user";
// import { getUserHours } from "../functions/airtable";

export async function tmp(req: Request, res: Response) {
  res.status(200).send({ message: "tmp endpoint" });

  let body = req.body;
  let { email } = body;

  // fetchUsers(email);

  await upgradeUser(client, email).then((result) => {
    // console.log(result);
  });

  // await getVerificationsUsers();
}
