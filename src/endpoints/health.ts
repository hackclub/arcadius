import { Request, Response } from "express";
import metrics from "../metrics";
import { blog } from "../util/Logger";

export async function healthEndpoint(req: Request, res: Response) {
  try {
    blog("Health check Hit", "info");
    metrics.increment("health.endpoint.hit");

    if (req.path === "/up") {
      metrics.increment("health.up");
      res.status(200).json({ message: "ok" });
    } else if (req.path === "/ping") {
      metrics.increment("health.ping");
      res.status(200).json({ message: "pong" });
    }
  } catch (error) {
    blog(`error with healthEndpoint: \n${error}`, "error");
    res.status(500).json({ error: "Internal Server Error" });
  }
}
