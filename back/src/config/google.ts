import { google } from "googleapis";
import { env } from "./env";

export const oauth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleRedirectUri
);
