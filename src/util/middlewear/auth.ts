import { NextFunction, Request, Response } from "express";

export async function protectAtAllCosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "No credentials sent!" });
    } else if (
      req.headers.authorization != `Bearer ${process.env.TrashPandaSecret}`
    ) {
      return res.status(403).json({ error: "Invalid credentials sent!" });
    } else {
      next();
    }
  } catch (e) {
    return res.status(500).json({ error: "An error occurred" });
  }
}
