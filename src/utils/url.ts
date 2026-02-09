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

function extractLinkedInJobId(pathname: string) {
  const match = pathname.match(/\/jobs\/view\/(\d+)/);
  return match?.[1];
}

function toCanonicalLinkedInJobUrl(parsed: URL) {
  const jobId = extractLinkedInJobId(parsed.pathname);
  if (!jobId) {
    return parsed.toString();
  }

  return `https://www.linkedin.com/jobs/view/${jobId}/`;
}

function toLinkedInIosSafeUrl(parsed: URL) {
  const jobId = extractLinkedInJobId(parsed.pathname);
  if (!jobId) {
    return toCanonicalLinkedInJobUrl(parsed);
  }

  // Use guest job endpoint on iOS to avoid LinkedIn app deep-link render errors.
  return `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
}

export function withUtmSource(url: string, source = UTM_SOURCE) {
  return withOutboundTracking(url, { source });
}

export function withOutboundTracking(
  url: string,
  options?: { source?: string; iosSafeLinkedIn?: boolean },
) {
  try {
    const parsed = new URL(normalizeExternalUrl(url));
    const source = options?.source ?? UTM_SOURCE;
    const iosSafeLinkedIn = options?.iosSafeLinkedIn ?? false;

    // Keep LinkedIn links unchanged because iOS universal-link behavior can be
    // affected by added tracking params. Also canonicalize job URLs so the app
    // receives the simplest possible path.
    if (isLinkedInHost(parsed.hostname)) {
      if (iosSafeLinkedIn) {
        return toLinkedInIosSafeUrl(parsed);
      }
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
