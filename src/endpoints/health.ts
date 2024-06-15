import { Request, Response } from "express";
import metrics from "../metrics";
import { slog } from "../util/Logger";

export async function healthEndpoint(req: Request, res: Response) {
  slog("Health check Hit", "info");
  metrics.increment("health.endpoint.hit");

  if (req.path === "/up") {
    res.status(200).json({ message: "ok" });
  } else if (req.path === "/ping") {
    res.status(200).json({ message: "pong" });
  }
}
