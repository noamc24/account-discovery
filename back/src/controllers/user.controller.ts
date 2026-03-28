import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "User not found on request",
    });
    return;
  }

  res.status(200).json({
    message: "Protected route works ✅",
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    },
  });
};