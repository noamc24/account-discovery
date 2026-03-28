import { Request, Response } from "express";
import { runScan } from "../services/scan.service";

export const scanEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        message: "Email is required",
      });
      return;
    }

    const results = await runScan(email);

    res.status(200).json({
      message: "Scan completed successfully",
      email,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Scan failed",
    });
  }
};