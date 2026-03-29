import { google, gmail_v1 } from "googleapis";
import { extractHeader, parseFromHeader } from "../utils/gmail";
import { NormalizedEmail } from "../types/scan";

type GmailTokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
  id_token?: string;
};

export type ScanMode = "quick" | "deep" | "full";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getScanConfig(mode: ScanMode) {
  if (mode === "quick") {
    return {
      query:
        'newer_than:6m (welcome OR "verify your email" OR "confirm your email" OR "reset your password" OR receipt OR invoice OR order OR payment OR unsubscribe OR account OR login OR security)',
      maxMessagesToProcess: 150,
      batchSize: 5,
      pauseBetweenBatchesMs: 350,
      pauseBetweenPagesMs: 150,
    };
  }

  if (mode === "deep") {
    return {
      query: "newer_than:1y",
      maxMessagesToProcess: 400,
      batchSize: 3,
      pauseBetweenBatchesMs: 500,
      pauseBetweenPagesMs: 200,
    };
  }

  return {
    query: "",
    maxMessagesToProcess: Number.POSITIVE_INFINITY,
    batchSize: 2,
    pauseBetweenBatchesMs: 700,
    pauseBetweenPagesMs: 250,
  };
}

export async function fetchNormalizedEmails(
  tokens: GmailTokens,
  mode: ScanMode = "quick"
): Promise<NormalizedEmail[]> {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expiry_date: tokens.expiry_date,
    id_token: tokens.id_token,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const config = getScanConfig(mode);

  const allMessages: gmail_v1.Schema$Message[] = [];
  let nextPageToken: string | undefined = undefined;

  while (true) {
    const listResult: { data: gmail_v1.Schema$ListMessagesResponse } =
      await gmail.users.messages.list({
        userId: "me",
        maxResults: 100,
        q: config.query,
        pageToken: nextPageToken,
      });

    const messages = (listResult.data.messages ||
      []) as gmail_v1.Schema$Message[];

    allMessages.push(...messages);

    if (allMessages.length >= config.maxMessagesToProcess) {
      break;
    }

    nextPageToken = listResult.data.nextPageToken || undefined;

    if (!nextPageToken) {
      break;
    }

    await sleep(config.pauseBetweenPagesMs);
  }

  if (!allMessages.length) {
    return [];
  }

  const messagesToProcess = allMessages.slice(0, config.maxMessagesToProcess);
  const normalizedEmails: NormalizedEmail[] = [];

  for (let i = 0; i < messagesToProcess.length; i += config.batchSize) {
    const batch = messagesToProcess.slice(i, i + config.batchSize);

    const settledBatch = await Promise.allSettled(
      batch.map((message) =>
        gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject"],
        })
      )
    );

    for (const result of settledBatch) {
      if (result.status !== "fulfilled") {
        const error: any = result.reason;
        const status = error?.status || error?.code;

        if (status === 403) {
          console.warn("Quota hit on message get, skipping one message.");
        } else {
          console.error("GET MESSAGE ERROR:", error);
        }

        continue;
      }

      const messageResponse = result.value;
      const headers = messageResponse.data.payload?.headers || [];
      const from = extractHeader(headers, "From");
      const subject = extractHeader(headers, "Subject");
      const snippet = messageResponse.data.snippet || "";
      const { fromEmail, fromDomain } = parseFromHeader(from);

      normalizedEmails.push({
        id: messageResponse.data.id || "",
        threadId: messageResponse.data.threadId || undefined,
        from,
        fromEmail,
        fromDomain,
        subject,
        snippet,
        internalDate: messageResponse.data.internalDate
          ? Number(messageResponse.data.internalDate)
          : undefined,
      });
    }

    console.log(
      `[GMAIL SCAN] Mode=${mode} Processed ${Math.min(
        i + config.batchSize,
        messagesToProcess.length
      )}/${messagesToProcess.length}`
    );

    await sleep(config.pauseBetweenBatchesMs);
  }

  return normalizedEmails;
}