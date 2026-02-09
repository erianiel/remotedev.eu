const UTM_SOURCE = "remotedev.eu";

export function withUtmSource(url: string, source = UTM_SOURCE) {
  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const queryIndex = withoutHash.indexOf("?");
  const base = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const searchParams = new URLSearchParams(query);

  searchParams.set("utm_source", source);

  return `${base}?${searchParams.toString()}${hash}`;
}
