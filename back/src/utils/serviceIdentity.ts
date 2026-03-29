const KNOWN_DOMAIN_MAP: Record<
  string,
  { serviceKey: string; serviceName: string; domain: string }
> = {
  "spotify.com": {
    serviceKey: "spotify",
    serviceName: "Spotify",
    domain: "spotify.com",
  },
  "amazon.com": {
    serviceKey: "amazon",
    serviceName: "Amazon",
    domain: "amazon.com",
  },
  "netflix.com": {
    serviceKey: "netflix",
    serviceName: "Netflix",
    domain: "netflix.com",
  },
  "facebookmail.com": {
    serviceKey: "facebook",
    serviceName: "Facebook",
    domain: "facebook.com",
  },
  "instagram.com": {
    serviceKey: "instagram",
    serviceName: "Instagram",
    domain: "instagram.com",
  },
  "x.com": {
    serviceKey: "x",
    serviceName: "X",
    domain: "x.com",
  },
  "twitter.com": {
    serviceKey: "x",
    serviceName: "X",
    domain: "x.com",
  },
  "linkedin.com": {
    serviceKey: "linkedin",
    serviceName: "LinkedIn",
    domain: "linkedin.com",
  },
  "tiktok.com": {
    serviceKey: "tiktok",
    serviceName: "TikTok",
    domain: "tiktok.com",
  },
  "apple.com": {
    serviceKey: "apple",
    serviceName: "Apple",
    domain: "apple.com",
  },
  "google.com": {
    serviceKey: "google",
    serviceName: "Google",
    domain: "google.com",
  },
  "discord.com": {
    serviceKey: "discord",
    serviceName: "Discord",
    domain: "discord.com",
  },
};

function getBaseDomain(domain: string): string {
  const cleanDomain = domain.toLowerCase().trim();
  const parts = cleanDomain.split(".");

  if (parts.length <= 2) {
    return cleanDomain;
  }

  return parts.slice(-2).join(".");
}

export function resolveServiceIdentity(fromDomain: string) {
  const cleanDomain = fromDomain.toLowerCase().trim();
  const baseDomain = getBaseDomain(cleanDomain);

  if (KNOWN_DOMAIN_MAP[cleanDomain]) {
    return KNOWN_DOMAIN_MAP[cleanDomain];
  }

  if (KNOWN_DOMAIN_MAP[baseDomain]) {
    return KNOWN_DOMAIN_MAP[baseDomain];
  }

  const guessedName = baseDomain.split(".")[0];
  const prettyName =
    guessedName.charAt(0).toUpperCase() + guessedName.slice(1);

  return {
    serviceKey: baseDomain.replace(/\./g, "-"),
    serviceName: prettyName,
    domain: baseDomain,
  };
}