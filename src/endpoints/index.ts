import { Request, Response } from "express";
import metrics from "../metrics";
import { blog } from "../util/Logger";

export async function indexEndpoint(req: Request, res: Response) {
  metrics.increment("indexEndpoint");
  blog("Index Endpoint Hit", "info");
  try {
    res.redirect("https://github.com/hackclub/arcadius");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
