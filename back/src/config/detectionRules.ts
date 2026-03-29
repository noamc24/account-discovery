import { DetectionType } from "../types/scan";

export interface DetectionRule {
  id: string;
  weight: number;
  type: DetectionType;
  evidenceText: string;
  test: (input: {
    from: string;
    fromEmail: string;
    fromDomain: string;
    subject: string;
    snippet: string;
    text: string;
  }) => boolean;
}

function containsAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

export const detectionRules: DetectionRule[] = [
  {
    id: "welcome-email",
    weight: 40,
    type: "Likely account",
    evidenceText: "Welcome / signup language",
    test: ({ text }) =>
      containsAny(text, [
        "welcome",
        "welcome to",
        "thanks for signing up",
        "account created",
        "getting started",
        "verify your email",
        "confirm your email",
        "activate your account",
      ]),
  },
  {
    id: "password-reset",
    weight: 35,
    type: "Likely account",
    evidenceText: "Password / verification flow",
    test: ({ text }) =>
      containsAny(text, [
        "reset your password",
        "password reset",
        "forgot your password",
        "forgot password",
        "security code",
        "verification code",
        "one-time code",
        "login code",
        "sign-in code",
      ]),
  },
  {
    id: "account-alert",
    weight: 25,
    type: "Likely account",
    evidenceText: "Account/security activity",
    test: ({ text }) =>
      containsAny(text, [
        "new sign-in",
        "new login",
        "login attempt",
        "suspicious activity",
        "security alert",
        "we noticed a login",
      ]),
  },
  {
    id: "purchase-receipt",
    weight: 25,
    type: "Purchase",
    evidenceText: "Purchase / receipt language",
    test: ({ text }) =>
      containsAny(text, [
        "receipt",
        "invoice",
        "your order",
        "order confirmed",
        "payment successful",
        "payment receipt",
        "thanks for your purchase",
      ]),
  },
  {
    id: "newsletter",
    weight: 12,
    type: "Newsletter",
    evidenceText: "Newsletter markers",
    test: ({ text }) =>
      containsAny(text, [
        "unsubscribe",
        "manage preferences",
        "email preferences",
        "newsletter",
      ]),
  },
];