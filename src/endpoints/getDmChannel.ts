import { Request, Response } from "express";
import { getDmChannelFromAirtable } from "../functions/slack/getDmChannelFromAirtable";

export async function getDmChannelEndpoint(req: Request, res: Response) {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is require (slack user id)" });
  } else {
    let dmChannel = await getDmChannelFromAirtable({
      slackId: userId as string,
    });
    res.status(200).json({ dmChannel });
  }
}
