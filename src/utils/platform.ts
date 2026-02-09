export function isIOSDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}
