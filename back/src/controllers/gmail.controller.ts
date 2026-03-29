import { Request, Response } from "express";
import { google } from "googleapis";
import {
  fetchNormalizedEmails,
  ScanMode,
} from "../services/gmail.service";
import { scanEmails } from "../services/scan.service";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function normalizeSessionTokens(tokens: any) {
  return {
    access_token: tokens?.access_token ?? undefined,
    refresh_token: tokens?.refresh_token ?? undefined,
    scope: tokens?.scope ?? undefined,
    token_type: tokens?.token_type ?? undefined,
    expiry_date: tokens?.expiry_date ?? undefined,
    id_token: tokens?.id_token ?? undefined,
  };
}

function getRequestedScanMode(mode: unknown): ScanMode {
  if (mode === "deep") return "deep";
  if (mode === "full") return "full";
  return "quick";
}

export function connectGmail(req: Request, res: Response) {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    });

    return res.redirect(url);
  } catch (error) {
    console.error("CONNECT GMAIL ERROR:", error);
    return res.status(500).json({
      message: "Failed to connect Gmail",
    });
  }
}

export async function gmailCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({
        message: "Missing Google authorization code",
      });
    }

    const { tokens } = await oauth2Client.getToken(code);

    req.session.tokens = {
      access_token: tokens.access_token ?? undefined,
      refresh_token: tokens.refresh_token ?? undefined,
      scope: tokens.scope ?? undefined,
      token_type: tokens.token_type ?? undefined,
      expiry_date: tokens.expiry_date ?? undefined,
      id_token: tokens.id_token ?? undefined,
    };

    req.session.save((err) => {
      if (err) {
        console.error("SESSION SAVE ERROR:", err);
        return res.status(500).json({
          message: "Failed to save Gmail session",
        });
      }

      return res.redirect("http://localhost:5173/dashboard");
    });
  } catch (error) {
    console.error("GMAIL CALLBACK ERROR:", error);
    return res.status(500).json({
      message: "Failed Gmail callback",
    });
  }
}

export async function getGmailMessages(req: Request, res: Response) {
  try {
    const sessionTokens = req.session.tokens;
    const mode = getRequestedScanMode(req.query.mode);

    if (!sessionTokens?.access_token) {
      return res.status(401).json({
        message: "Gmail is not connected",
      });
    }

    const tokens = normalizeSessionTokens(sessionTokens);
    const messages = await fetchNormalizedEmails(tokens, mode);

    return res.status(200).json({
      message: "Fetched Gmail messages successfully",
      mode,
      messages,
    });
  } catch (error) {
    console.error("GET GMAIL MESSAGES ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch Gmail messages",
    });
  }
}

export async function scanGmailAccounts(req: Request, res: Response) {
  try {
    const sessionTokens = req.session.tokens;
    const mode = getRequestedScanMode(req.query.mode);

    if (!sessionTokens?.access_token) {
      return res.status(401).json({
        message: "Gmail is not connected",
      });
    }

    const tokens = normalizeSessionTokens(sessionTokens);
    const emails = await fetchNormalizedEmails(tokens, mode);
    const results = scanEmails(emails);

    return res.status(200).json({
      message: `Scan completed successfully (${mode} mode)`,
      mode,
      totalEmailsScanned: emails.length,
      totalServicesFound: results.length,
      results,
    });
  } catch (error) {
    console.error("SCAN GMAIL ACCOUNTS ERROR:", error);
    return res.status(500).json({
      message: "Failed to scan Gmail accounts",
    });
  }
}