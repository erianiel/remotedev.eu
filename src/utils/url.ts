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

function toCanonicalLinkedInJobUrl(parsed: URL) {
  const match = parsed.pathname.match(/\/jobs\/view\/(\d+)/);
  if (!match) {
    return parsed.toString();
  }

  return `https://www.linkedin.com/jobs/view/${match[1]}/`;
}

export function withUtmSource(url: string, source = UTM_SOURCE) {
  try {
    const parsed = new URL(normalizeExternalUrl(url));

    // Keep LinkedIn links unchanged because iOS universal-link behavior can be
    // affected by added tracking params. Also canonicalize job URLs so the app
    // receives the simplest possible path.
    if (isLinkedInHost(parsed.hostname)) {
      return toCanonicalLinkedInJobUrl(parsed);
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
