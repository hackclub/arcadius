import { Request, Response } from "express";

export async function index(req: Request, res: Response) {
  res.redirect("https://github.com/hackclub/8-bit-heart");
}
