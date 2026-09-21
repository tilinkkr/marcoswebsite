import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import shared from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { authorPath, getAuthor, MARCOS_AUTHORS } from "@/lib/authors";
import { getBlogs } from "@/lib/blogs";
import { absoluteUrl, safeJsonLd } from "@/lib/site";

import styles from "./author.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MARCOS_AUTHORS.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role}`,
    description: `${author.name}'s public MARCOS role, editorial focus, and published contributions.`,
    alternates: { canonical: authorPath(author.slug) },
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();
  const posts = (await getBlogs()).filter(
    (post) => post.author_slug === author.slug,
  );
  const profileUrl = absoluteUrl(authorPath(author.slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: author.name,
    url: profileUrl,
    jobTitle: author.role,
    worksFor: { "@id": `${absoluteUrl("/")}#organization` },
    description: author.bio,
  };

  return (
    <div className={shared.page}>
      <SiteHeader />
      <main className={shared.main}>
        <section className={`${shared.hero} ${styles.hero}`}>
          <p className={shared.eyebrow}>MARCOS / AUTHOR ACCOUNTABILITY</p>
          <h1 className={shared.title}>{author.name.toUpperCase()}</h1>
          <p className={styles.role}>
            {author.role} / {author.focus}
          </p>
          <p className={shared.lede}>{author.bio}</p>
        </section>

        <section className={`${shared.section} ${styles.standard}`}>
          <div>
            <p className={shared.sectionLabel}>01 / VERIFICATION SCOPE</p>
            <h2 className={shared.sectionTitle}>
              WHAT THIS
              <br />
              PROFILE PROVES.
            </h2>
          </div>
          <div className={styles.statement}>
            <p>
              This page identifies the person&apos;s public role and area of
              responsibility at MARCOS. It does not claim investment
              performance, regulated status, academic credentials, or years of
              market experience that MARCOS has not independently evidenced.
            </p>
            <p>
              Every published article must separately link the evidence used to
              support its author and reviewer selection, along with its sources,
              method, limitations, and conflicts disclosure.
            </p>
            <Link href="/insights">READ THE EDITORIAL RECORD →</Link>
          </div>
        </section>

        <section className={`${shared.section} ${styles.work}`}>
          <div>
            <p className={shared.sectionLabel}>02 / PUBLISHED WORK</p>
            <h2 className={shared.sectionTitle}>VERIFIED CONTRIBUTIONS.</h2>
          </div>
          <div className={styles.posts}>
            {posts.length ? (
              posts.map((post) => (
                <Link href={`/insights/${post.slug}`} key={post.id}>
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>
                    Reviewed{" "}
                    {post.last_reviewed_at
                      ? new Date(post.last_reviewed_at).toLocaleDateString(
                          "en-IN",
                        )
                      : "—"}
                  </p>
                </Link>
              ))
            ) : (
              <p className={styles.empty}>
                No evidence-cleared articles are currently published under this
                byline.
              </p>
            )}
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
