import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/public-pages.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getBlogs } from "@/lib/blogs";
import local from "./insights.module.css";
export const metadata: Metadata = {
  title: "Insights",
  description:
    "MARCOS educational writing on prop-trading rules, risk and disciplined process.",
};
export default async function InsightsPage() {
  const posts = await getBlogs();
  const featured = posts.find((x) => x.featured) ?? posts[0];
  const remaining = posts.filter((post) => post.id !== featured?.id);
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>MARCOS / INSIGHTS</p>
          <h1 className={styles.title}>
            STUDY THE
            <br />
            RULES FIRST.
          </h1>
          <p className={styles.lede}>
            Clear, careful writing about risk, evaluations and the systems
            around a trading decision.
          </p>
        </section>
        <section className={styles.section}>
          {featured ? (
            <Link
              className={local.featured}
              href={`/insights/${featured.slug}`}
            >
              <div>
                <span>{featured.category} / FEATURED</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <small>
                  {featured.author_name} · {featured.reading_time} MIN READ ·
                  UPDATED{" "}
                  {new Date(featured.updated_at).toLocaleDateString("en-IN")}
                </small>
              </div>
              <Image
                src={featured.hero_image}
                alt="Abstract prop-firm risk boundaries"
                width={1600}
                height={900}
                sizes="(max-width: 767px) 100vw, 46vw"
              />
            </Link>
          ) : (
            <p>No published insights yet.</p>
          )}
          {remaining.length > 0 && (
            <div className={local.grid}>
              {remaining.map((post) => (
                <Link
                  className={local.card}
                  href={`/insights/${post.slug}`}
                  key={post.id}
                >
                  <Image
                    src={post.hero_image}
                    alt=""
                    width={960}
                    height={540}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <span>{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <small>
                    {post.reading_time} MIN READ ·{" "}
                    {new Date(post.updated_at).toLocaleDateString("en-IN")}
                  </small>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
