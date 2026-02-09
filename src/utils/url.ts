const UTM_SOURCE = "remotedev.eu";
const SCHEME_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
const LINKEDIN_JOB_REGEX = /\/jobs\/view\/(\d+)/;
const TRACKABLE_PROTOCOLS = new Set(["http:", "https:"]);

function normalizeExternalUrl(url: string) {
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (SCHEME_REGEX.test(trimmed)) {
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
  const jobId = parsed.pathname.match(LINKEDIN_JOB_REGEX)?.[1];
  if (!jobId) {
    return parsed.toString();
  }

  return `https://www.linkedin.com/jobs/view/${jobId}/`;
}

export function withUtmSource(url: string, source = UTM_SOURCE) {
  try {
    const parsed = new URL(normalizeExternalUrl(url));
    const targetUrl = isLinkedInHost(parsed.hostname)
      ? new URL(toCanonicalLinkedInJobUrl(parsed))
      : parsed;

    if (!TRACKABLE_PROTOCOLS.has(targetUrl.protocol)) {
      return targetUrl.toString();
    }

    targetUrl.searchParams.set("utm_source", source);
    return targetUrl.toString();
  } catch {
    return url;
  }
}
