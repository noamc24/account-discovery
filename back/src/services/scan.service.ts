import { detectionRules } from "../config/detectionRules";
import {
  DetectionType,
  NormalizedEmail,
  ServiceDetection,
  DetectionEvidence,
  Confidence,
} from "../types/scan";
import { resolveServiceIdentity } from "../utils/serviceIdentity";

function getConfidence(score: number): Confidence {
  if (score >= 70) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function normalizeText(email: NormalizedEmail) {
  return `${email.from} ${email.fromEmail} ${email.fromDomain} ${email.subject} ${email.snippet}`.toLowerCase();
}

function pickType(types: DetectionType[]): DetectionType {
  if (types.includes("Likely account")) return "Likely account";
  if (types.includes("Purchase")) return "Purchase";
  if (types.includes("Newsletter")) return "Newsletter";
  return "Unknown";
}

export function scanEmails(emails: NormalizedEmail[]): ServiceDetection[] {
  const grouped = new Map<string, ServiceDetection>();

  for (const email of emails) {
    if (!email.fromDomain) continue;

    const text = normalizeText(email);
    const identity = resolveServiceIdentity(email.fromDomain);

    let score = 0;
    const evidence: DetectionEvidence[] = [];
    const matchedTypes: DetectionType[] = [];

    for (const rule of detectionRules) {
      const matched = rule.test({
        from: email.from.toLowerCase(),
        fromEmail: email.fromEmail.toLowerCase(),
        fromDomain: email.fromDomain.toLowerCase(),
        subject: email.subject.toLowerCase(),
        snippet: email.snippet.toLowerCase(),
        text,
      });

      if (matched) {
        score += rule.weight;
        matchedTypes.push(rule.type);
        evidence.push({
          rule: rule.id,
          matchedText: rule.evidenceText,
          weight: rule.weight,
        });
      }
    }

    // Bonus if sender domain looks like the service itself
    if (identity.domain && email.fromDomain.includes(identity.domain)) {
      score += 20;
      evidence.push({
        rule: "domain-match",
        matchedText: `Sender domain matched ${identity.domain}`,
        weight: 20,
      });
    }

    // Skip very weak detections
    if (score < 20) {
      continue;
    }

    const type = pickType(matchedTypes);
    const confidence = getConfidence(score);

    const existing = grouped.get(identity.serviceKey);

    if (!existing) {
      grouped.set(identity.serviceKey, {
        serviceKey: identity.serviceKey,
        serviceName: identity.serviceName,
        domain: identity.domain,
        type,
        confidence,
        score,
        evidence,
        relatedEmailIds: [email.id],
      });
    } else {
      existing.score += score;
      existing.relatedEmailIds.push(email.id);
      existing.evidence.push(...evidence);

      if (existing.type !== "Likely account" && type === "Likely account") {
        existing.type = "Likely account";
      } else if (existing.type === "Unknown") {
        existing.type = type;
      }

      existing.confidence = getConfidence(existing.score);
    }
  }

  const results = Array.from(grouped.values())
    .map((item) => {
      // Remove duplicate evidence rows
      const uniqueEvidenceMap = new Map<string, DetectionEvidence>();

      for (const ev of item.evidence) {
        const key = `${ev.rule}-${ev.matchedText}`;
        if (!uniqueEvidenceMap.has(key)) {
          uniqueEvidenceMap.set(key, ev);
        }
      }

      return {
        ...item,
        evidence: Array.from(uniqueEvidenceMap.values()),
        relatedEmailIds: Array.from(new Set(item.relatedEmailIds)),
        confidence: getConfidence(item.score),
      };
    })
    .sort((a, b) => b.score - a.score);

  return results;
}