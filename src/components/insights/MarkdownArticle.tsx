import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^\)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    return match ? (
      <Link key={i} href={match[2]}>
        {match[1]}
      </Link>
    ) : (
      part
    );
  });
}
export function MarkdownArticle({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      nodes.push(
        <ul key={`list-${nodes.length}`}>
          {list.map((x) => (
            <li key={x}>{inline(x)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  lines.forEach((line) => {
    if (!line.trim()) {
      flush();
      return;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flush();
    if (line.startsWith("### "))
      nodes.push(<h3 key={nodes.length}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## "))
      nodes.push(<h2 key={nodes.length}>{inline(line.slice(3))}</h2>);
    else if (line.startsWith("# ")) {
    } else nodes.push(<p key={nodes.length}>{inline(line)}</p>);
  });
  flush();
  return <>{nodes}</>;
}
