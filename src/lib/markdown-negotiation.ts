export const AGENT_CONTENT_SIGNAL = "ai-train=yes, search=yes, ai-input=yes";

export function estimateMarkdownTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  const lower = acceptHeader.toLowerCase();
  if (!lower.includes("text/markdown")) return false;

  const parseQ = (mime: string): number => {
    const parts = lower.split(",").map((p) => p.trim());
    for (const part of parts) {
      if (part.startsWith(mime)) {
        const match = part.match(/;\s*q=([0-9.]+)/);
        return match ? Number.parseFloat(match[1]) || 0 : 1;
      }
    }
    return -1;
  };

  const mdQ = parseQ("text/markdown");
  const htmlQ = parseQ("text/html");
  if (mdQ <= 0) return false;
  if (htmlQ < 0) return true;
  return mdQ >= htmlQ;
}
