import { Request, Response } from "express";
import { getDmChannelFromAirtable } from "../functions/slack/getDmChannelFromAirtable";
import metrics from "../metrics";
import { blog } from "../util/Logger";

export async function getDmChannelEndpoint(req: Request, res: Response) {
  try {
    metrics.increment("getDmChannelEndpoint");
    const userId = req.query.userId;

    const tsStart = Date.now();
    blog(`getDmChannelEndpoint: userId: ${userId}`, "info");

    if (!userId) {
      blog(`getDmChannelEndpoint: userId is require (slack user id)`, "error");
      return res
        .status(400)
        .json({ error: "userId is require (slack user id)" });
    } else {
      let dmChannel = await getDmChannelFromAirtable({
        slackId: userId as string,
      });
      metrics.timing("getDmChannelEndpoint", Date.now() - tsStart);
      blog(`getDmChannelEndpoint: success`, "info");
      return res.status(200).json({ dmChannel });
    }
  } catch (error) {
    blog(`error with getDmChannelEndpoint: \n${error}`, "error");
    blog(`error with getDmChannelEndpoint: \n${error}`, "error");
    res.status(500).json({ error: "Internal Server Error" });
  }
}
