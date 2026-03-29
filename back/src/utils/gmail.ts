export function extractHeader(
  headers: Array<{ name?: string | null; value?: string | null }> = [],
  headerName: string
): string {
  const header = headers.find(
    (h) => h.name?.toLowerCase() === headerName.toLowerCase()
  );

  return header?.value || "";
}

export function parseFromHeader(from: string) {
  // Example:
  // "Spotify <no-reply@spotify.com>"
  // "Amazon <store-news@amazon.com>"
  // "no-reply@netflix.com"

  const emailMatch = from.match(/<([^>]+)>/);
  const rawEmail = emailMatch ? emailMatch[1] : from.trim();

  const fromEmail = rawEmail.toLowerCase();
  const fromDomain = fromEmail.includes("@")
    ? fromEmail.split("@")[1].toLowerCase()
    : "";

  return {
    fromEmail,
    fromDomain,
  };
}