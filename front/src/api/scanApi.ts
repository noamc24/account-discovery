export interface DetectionEvidence {
  rule: string;
  matchedText: string;
  weight: number;
}

export interface ScanResult {
  serviceKey: string;
  serviceName: string;
  domain: string;
  type: string;
  confidence: "High" | "Medium" | "Low";
  score: number;
  evidence: DetectionEvidence[];
  relatedEmailIds: string[];
}

export interface ScanResponse {
  message: string;
  mode: "quick" | "deep";
  totalEmailsScanned: number;
  totalServicesFound: number;
  results: ScanResult[];
}

const API_BASE_URL = "http://localhost:5000/api";

export const scanEmailRequest = async (
  mode: "quick" | "deep" | "full"
): Promise<ScanResponse> => {
  const response = await fetch(`${API_BASE_URL}/gmail/scan?mode=${mode}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Scan failed");
  }

  return data;
};