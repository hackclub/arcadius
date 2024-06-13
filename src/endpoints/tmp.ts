import { Request, Response } from "express";
import { fetchUsers } from "../functions/jankySlackCrap";
// import { getUserHours } from "../functions/airtable";

export async function tmp(req: Request, res: Response) {
  res.status(200).send({ message: "tmp endpoint" });

  let body = req.body;
  let { email } = body;

  fetchUsers(email);
}
