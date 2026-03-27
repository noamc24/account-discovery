import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: "Protected route works ✅",
    user: req.user,
  });
};