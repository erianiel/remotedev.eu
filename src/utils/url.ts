const UTM_SOURCE = "remotedev.eu";

function hasScheme(url: string) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

function normalizeExternalUrl(url: string) {
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (hasScheme(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function isLinkedInHost(hostname: string) {
  return (
    hostname === "linkedin.com" ||
    hostname.endsWith(".linkedin.com") ||
    hostname === "lnkd.in"
  );
}

export function withUtmSource(url: string, source = UTM_SOURCE) {
  try {
    const parsed = new URL(normalizeExternalUrl(url));

    // Keep LinkedIn links unchanged because iOS universal-link behavior can be
    // affected by added tracking params.
    if (isLinkedInHost(parsed.hostname)) {
      return parsed.toString();
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return parsed.toString();
    }

    parsed.searchParams.set("utm_source", source);
    return parsed.toString();
  } catch {
    return url;
  }
}
