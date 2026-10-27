import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(
    /(\[[^\]]+\]\((?:https?:\/\/|\/(?!\/)|#)[^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g,
  );

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return /^https?:\/\//i.test(href) ? (
        <a key={index} href={href} target="_blank" rel="noreferrer noopener">
          {label}
        </a>
      ) : (
        <Link key={index} href={href}>
          {label}
        </Link>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function MarkdownArticle({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  let listType: "ol" | "ul" = "ul";
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    nodes.push(
      <p key={`paragraph-${nodes.length}`}>{inline(paragraph.join(" "))}</p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    const items = list.map((item, index) => (
      <li key={`${nodes.length}-${index}`}>{inline(item)}</li>
    ));
    nodes.push(
      listType === "ol" ? (
        <ol key={`list-${nodes.length}`}>{items}</ol>
      ) : (
        <ul key={`list-${nodes.length}`}>{items}</ul>
      ),
    );
    list = [];
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const unorderedItem = line.match(/^\s*[-*]\s+(.+)$/);
    const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextListType = orderedItem ? "ol" : "ul";
      if (list.length && listType !== nextListType) flushList();
      listType = nextListType;
      list.push((orderedItem ?? unorderedItem)![1]);
      continue;
    }

    flushList();
    if (line.trim() === "---" || line.trim() === "***") {
      flushParagraph();
      nodes.push(<hr key={`rule-${nodes.length}`} />);
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      nodes.push(<h3 key={nodes.length}>{inline(line.slice(4))}</h3>);
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      nodes.push(<h2 key={nodes.length}>{inline(line.slice(3))}</h2>);
      continue;
    }
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return <>{nodes}</>;
}
