export type MarcosAuthor = {
  slug: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
};

export const MARCOS_AUTHORS: readonly MarcosAuthor[] = [
  {
    slug: "rahul-raja",
    name: "Rahul Raja",
    role: "COO",
    focus: "Operations, execution, and community standards",
    bio: "Rahul leads day-to-day operations and execution at MARKOS, helping keep community standards and member experiences consistent.",
  },
  {
    slug: "linu-babu",
    name: "Linu Babu",
    role: "CEO",
    focus: "Operations and execution",
    bio: "Linu leads operations and execution across MARKOS, turning the platform vision into repeatable systems.",
  },
  {
    slug: "tilin-bijoy",
    name: "Tilin Bijoy",
    role: "CTO",
    focus: "Product and platform technology",
    bio: "Tilin leads MARKOS technology, including product experience, backend systems, and community tooling.",
  },
  {
    slug: "sahal",
    name: "Sahal",
    role: "Content Creator & Analyst",
    focus: "Market education, analysis, and content",
    bio: "Sahal creates market-focused educational content and analysis for the MARKOS community, with a focus on explaining process and risk.",
  },
] as const;

export function getAuthor(slug: string | null | undefined) {
  if (!slug) return null;
  return MARCOS_AUTHORS.find((author) => author.slug === slug) ?? null;
}

export function getAuthorByName(name: string | null | undefined) {
  if (!name) return null;
  return MARCOS_AUTHORS.find((author) => author.name === name) ?? null;
}

export function authorPath(slug: string) {
  return `/team/authors/${slug}`;
}
