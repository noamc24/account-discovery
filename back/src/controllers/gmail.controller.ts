import { Request, Response } from "express";
import { oauth2Client } from "../config/google";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export const getAuthUrl = (_req: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  res.status(200).json({ url });
};

export const redirectToGoogleAuth = (_req: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  res.redirect(url);
};

export const handleGoogleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("=== Gmail callback hit ===");
    console.log("Query:", req.query);
    console.log("Session exists:", !!req.session);

    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ message: "No code provided" });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);

    console.log("Tokens received:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });

    req.session.tokens = tokens;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        res.status(500).json({ message: "Failed to save session" });
        return;
      }

      console.log("Session saved successfully");
      res.redirect("http://localhost:5173/dashboard");
    });
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to authenticate with Google",
    });
  }
};