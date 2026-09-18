export const SITE_URL = "https://markos.in";
export const SITE_NAME = "MARCOS";

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
