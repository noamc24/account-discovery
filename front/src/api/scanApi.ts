export interface ScanResult {
  serviceName: string;
  type: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string;
}

export interface ScanResponse {
  message: string;
  email: string;
  results: ScanResult[];
}

const API_BASE_URL = "http://localhost:5000/api";

export const scanEmailRequest = async (
  email: string,
  token: string
): Promise<ScanResponse> => {
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Scan failed");
  }

  return data;
};