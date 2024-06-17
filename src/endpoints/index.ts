import { Request, Response } from "express";

export async function indexEndpoint(req: Request, res: Response) {
  res.redirect("https://github.com/hackclub/arcadius");
}
