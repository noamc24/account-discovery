export type Confidence = "High" | "Medium" | "Low";

export type DetectionType =
  | "Likely account"
  | "Purchase"
  | "Newsletter"
  | "Unknown";

export interface NormalizedEmail {
  id: string;
  threadId?: string;
  from: string;
  fromEmail: string;
  fromDomain: string;
  subject: string;
  snippet: string;
  internalDate?: number;
}

export interface DetectionEvidence {
  rule: string;
  matchedText: string;
  weight: number;
}

export interface ServiceDetection {
  serviceKey: string;
  serviceName: string;
  domain: string;
  type: DetectionType;
  confidence: Confidence;
  score: number;
  evidence: DetectionEvidence[];
  relatedEmailIds: string[];
}