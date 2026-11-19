export type Faq = { question: string; answer: string };

/** Markdown inline syntax → plain text for structured data. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Collects question/answer pairs from an article for FAQPage data:
 * - `### Question?` headings inside a `## Frequently asked questions`
 *   section, answered by the following paragraph(s);
 * - legacy `**FAQ: Question?**` lines followed by an answer paragraph.
 */
export function extractFaqs(markdown: string): Faq[] {
  const faqs: Faq[] = [];
  const blocks = markdown.split(/\r?\n\s*\r?\n/).map((block) => block.trim());
  let inFaqSection = false;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (/^##\s/.test(block) && !/^###\s/.test(block)) {
      inFaqSection = /^##\s+frequently asked questions\b/i.test(block);
      continue;
    }

    const legacy = block.match(/^\*\*FAQ:\s*(.+?)\*\*$/i);
    const heading = inFaqSection ? block.match(/^###\s+(.+)$/) : null;
    const question = legacy?.[1] ?? heading?.[1];
    if (!question) continue;

    const answerParts: string[] = [];
    while (
      index + 1 < blocks.length &&
      blocks[index + 1] &&
      !/^#{2,3}\s/.test(blocks[index + 1]) &&
      !/^\*\*FAQ:/i.test(blocks[index + 1]) &&
      !/^\*[^*]/.test(blocks[index + 1])
    ) {
      answerParts.push(blocks[index + 1]);
      index += 1;
      if (legacy) break;
    }

    const answer = plainText(answerParts.join(" "));
    if (answer) faqs.push({ question: plainText(question), answer });
  }

  return faqs;
}
