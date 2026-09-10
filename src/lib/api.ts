export function getPublicApiUrl() {
  const configured = process.env.NEXT_PUBLIC_MARCOS_API_URL?.trim();

  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : null;
}
