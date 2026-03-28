import { google } from "googleapis";
import { oauth2Client } from "../config/google";

export const fetchEmails = async (tokens: any) => {
  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  return res.data.messages || [];
};