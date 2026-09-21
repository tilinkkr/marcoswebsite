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
    role: "Founder",
    focus: "Strategy and community standards",
    bio: "Rahul sets the direction for MARCOS, including its community standards and long-term platform vision.",
  },
  {
    slug: "linu-babu",
    name: "Linu Babu",
    role: "CEO",
    focus: "Operations and execution",
    bio: "Linu leads operations and execution across MARCOS, turning the platform vision into repeatable systems.",
  },
  {
    slug: "tilin-bijoy",
    name: "Tilin Bijoy",
    role: "CTO",
    focus: "Product and platform technology",
    bio: "Tilin leads MARCOS technology, including product experience, backend systems, and community tooling.",
  },
  {
    slug: "sahal",
    name: "Sahal",
    role: "Content & Community",
    focus: "Content and community communication",
    bio: "Sahal supports MARCOS through market-focused content, communication, and community interaction.",
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
