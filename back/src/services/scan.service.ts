interface ScanResult {
  serviceName: string;
  type: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string;
}

const commonResults: ScanResult[] = [
  {
    serviceName: "Spotify",
    type: "Likely account",
    confidence: "High",
    evidence: "Welcome email + password reset pattern",
  },
  {
    serviceName: "Amazon",
    type: "Purchase relationship",
    confidence: "High",
    evidence: "Order confirmation and receipt activity",
  },
  {
    serviceName: "LinkedIn",
    type: "Likely account",
    confidence: "Medium",
    evidence: "Security alert and sign-in emails",
  },
  {
    serviceName: "Adidas",
    type: "Newsletter only",
    confidence: "Low",
    evidence: "Marketing emails with unsubscribe header",
  },
];

const domainBasedExtras: Record<string, ScanResult[]> = {
  "gmail.com": [
    {
      serviceName: "Google",
      type: "Confirmed account evidence",
      confidence: "High",
      evidence: "Primary provider match and account activity pattern",
    },
  ],
  "outlook.com": [
    {
      serviceName: "Microsoft",
      type: "Confirmed account evidence",
      confidence: "High",
      evidence: "Primary provider match and account activity pattern",
    },
  ],
  "yahoo.com": [
    {
      serviceName: "Yahoo",
      type: "Likely account",
      confidence: "Medium",
      evidence: "Mailbox provider pattern and account alerts",
    },
  ],
};

export const runScan = async (email: string): Promise<ScanResult[]> => {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1] || "";

  const extraResults = domainBasedExtras[domain] || [];

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return [...extraResults, ...commonResults];
};