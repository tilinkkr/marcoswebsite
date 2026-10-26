"use client";

import { ExternalLink, LogOut, RefreshCw, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MARCOS_AUTHORS } from "@/lib/authors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

import styles from "./admin.module.css";

type Submission = {
  id: string;
  form_type: string;
  status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: Record<string, unknown>;
  attachment_path: string | null;
  created_at: string;
};
type Blog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  hero_image: string;
  author_name: string;
  author_slug: string;
  author_proof_url: string | null;
  publication_mode: "human" | "automated";
  status: "draft" | "review" | "published" | "archived";
  seo_title: string;
  seo_description: string;
  canonical_url: string | null;
  og_image: string | null;
  featured: boolean;
  category: string;
  tags: string[];
  requires_regulatory_review: boolean;
  reading_time: number;
  reviewer_name: string;
  reviewer_qualification: string;
  reviewer_proof_url: string | null;
  methodology: string;
  limitations: string;
  conflicts_disclosure: string;
  source_urls: string[];
  editorial_verified: boolean;
  updated_at: string;
};
type Audit = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changed_fields: string[];
  metadata: Record<string, unknown>;
  created_at: string;
};

export function AdminConsole({
  adminName,
  adminCount,
  submissions,
  blogs,
  audit,
  heartbeat,
}: {
  adminName: string;
  adminCount: number;
  submissions: Submission[];
  blogs: Blog[];
  audit: Audit[];
  heartbeat: string | null;
}) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);

  async function logout() {
    await createSupabaseBrowserClient()?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  async function changeStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setNotice(
      response.ok ? "Submission status updated." : "Status update failed.",
    );
    if (response.ok) router.refresh();
  }

  async function saveBlog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setNotice("");
    const form = new FormData(formElement);
    const authorSlug = String(form.get("author_slug") ?? "");
    const author = MARCOS_AUTHORS.find((item) => item.slug === authorSlug);
    const payload = {
      slug: form.get("slug"),
      title: form.get("title"),
      excerpt: form.get("excerpt"),
      content_markdown: form.get("content_markdown"),
      hero_image: form.get("hero_image"),
      author_name: author?.name ?? "",
      author_slug: authorSlug,
      author_proof_url: form.get("author_proof_url"),
      status: form.get("status"),
      seo_title: form.get("seo_title"),
      seo_description: form.get("seo_description"),
      category: form.get("category"),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.get("featured") === "on",
      requires_regulatory_review:
        form.get("requires_regulatory_review") === "on",
      reading_time: Number(form.get("reading_time")),
      canonical_url: form.get("canonical_url"),
      og_image: form.get("og_image"),
      reviewer_name: form.get("reviewer_name"),
      reviewer_qualification: form.get("reviewer_qualification"),
      reviewer_proof_url: form.get("reviewer_proof_url"),
      methodology: form.get("methodology"),
      limitations: form.get("limitations"),
      conflicts_disclosure: form.get("conflicts_disclosure"),
      source_urls: String(form.get("source_urls") ?? "")
        .split(/\r?\n|,/)
        .map((source) => source.trim())
        .filter(Boolean),
      editorial_verified: form.get("editorial_verified") === "on",
    };
    const response = await fetch(
      editing ? `/api/admin/blogs/${editing.id}` : "/api/admin/blogs",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const body = await response.json().catch(() => null);
    const evidenceIssues = body?.issues?.fieldErrors?.status?.join(" ");
    setNotice(
      response.ok
        ? editing
          ? "Article updated and the public insights page refreshed."
          : "Article saved and the public insights page refreshed."
        : [body?.error, evidenceIssues].filter(Boolean).join(" ") ||
            "Article could not be saved.",
    );
    setSaving(false);
    if (response.ok) {
      formElement.reset();
      setEditing(null);
      router.refresh();
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>MARKOS / CONTROL ROOM</p>
          <h1>OPERATIONS DESK</h1>
          <span>Signed in as {adminName}</span>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => router.refresh()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      <section className={styles.metrics} aria-label="Admin overview">
        <article>
          <span>SUBMISSIONS</span>
          <strong>{submissions.length}</strong>
          <small>latest 100</small>
        </article>
        <article>
          <span>ARTICLES</span>
          <strong>{blogs.length}</strong>
          <small>all states</small>
        </article>
        <article>
          <span>ADMINS</span>
          <strong>{adminCount}/3</strong>
          <small>hard database limit</small>
        </article>
        <article>
          <span>AUTOMATION</span>
          <strong>{heartbeat ? "ONLINE" : "PENDING"}</strong>
          <small>
            {heartbeat
              ? new Date(heartbeat).toLocaleString("en-IN")
              : "first cron run"}
          </small>
        </article>
      </section>

      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>01 / INTAKE</p>
            <h2>REGISTERED DETAILS</h2>
          </div>
          <span>Every submitted field remains available under Details.</span>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Received</th>
                <th>Form</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleString("en-IN")}</td>
                  <td>
                    <code>{item.form_type}</code>
                  </td>
                  <td>{item.name || "—"}</td>
                  <td>{item.email || "—"}</td>
                  <td>{item.phone || "—"}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        changeStatus(item.id, event.target.value)
                      }
                      aria-label={`Status for ${item.name ?? item.id}`}
                    >
                      {[
                        "new",
                        "reviewing",
                        "approved",
                        "rejected",
                        "archived",
                      ].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <details>
                      <summary>View</summary>
                      <pre>{JSON.stringify(item.payload, null, 2)}</pre>
                      {item.attachment_path && (
                        <a
                          href={`/api/admin/submissions/${item.id}/attachment`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open attachment <ExternalLink size={13} />
                        </a>
                      )}
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>02 / EDITORIAL GATE</p>
              <h2>{editing ? "EDIT INSIGHT" : "NEW INSIGHT"}</h2>
            </div>
            {editing && (
              <button
                className={styles.quietButton}
                type="button"
                onClick={() => setEditing(null)}
              >
                New article
              </button>
            )}
          </div>
          <p className={styles.editorGuide}>
            Manual publishing requires a matched MARKOS byline, public author
            and reviewer evidence, three authoritative sources, visible method
            and limitations, a conflicts disclosure, and fresh human
            attestation. Daily campaign articles use a separate AI-labeled
            workflow and are never presented as human-reviewed.
          </p>
          <form
            className={styles.editor}
            key={editing?.id ?? "new"}
            onSubmit={saveBlog}
          >
            <label>
              Title
              <input
                name="title"
                minLength={8}
                defaultValue={editing?.title}
                required
              />
            </label>
            <label>
              Slug
              <input
                name="slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                defaultValue={editing?.slug}
                required
              />
            </label>
            <label>
              Category
              <input
                name="category"
                defaultValue={editing?.category ?? "MARKET EDUCATION"}
                required
              />
            </label>
            <label>
              Author
              <select
                name="author_slug"
                defaultValue={editing?.author_slug ?? ""}
                required
              >
                <option value="" disabled>
                  Select a named author
                </option>
                {MARCOS_AUTHORS.map((author) => (
                  <option value={author.slug} key={author.slug}>
                    {author.name} — {author.role}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.full}>
              Public author evidence URL
              <input
                name="author_proof_url"
                type="url"
                defaultValue={editing?.author_proof_url ?? ""}
                placeholder="https://…"
              />
            </label>
            <label className={styles.full}>
              Excerpt
              <textarea
                name="excerpt"
                minLength={30}
                defaultValue={editing?.excerpt}
                required
              />
            </label>
            <label className={styles.full}>
              Article markdown
              <textarea
                name="content_markdown"
                minLength={100}
                rows={14}
                defaultValue={editing?.content_markdown}
                required
              />
            </label>
            <label className={styles.full}>
              Hero image path
              <input
                name="hero_image"
                defaultValue={
                  editing?.hero_image ??
                  "/images/marcos/insights/prop-firm-rules-india-2026.webp"
                }
                required
              />
            </label>
            <label>
              SEO title
              <input
                name="seo_title"
                minLength={8}
                defaultValue={editing?.seo_title}
                required
              />
            </label>
            <label>
              Reading minutes
              <input
                name="reading_time"
                type="number"
                min="1"
                max="120"
                defaultValue={editing?.reading_time ?? 5}
                required
              />
            </label>
            <label className={styles.full}>
              SEO description
              <textarea
                name="seo_description"
                minLength={30}
                maxLength={320}
                defaultValue={editing?.seo_description}
                required
              />
            </label>
            <label>
              Canonical URL (optional)
              <input
                name="canonical_url"
                type="url"
                defaultValue={editing?.canonical_url ?? ""}
              />
            </label>
            <label>
              Open Graph image (optional)
              <input
                name="og_image"
                defaultValue={editing?.og_image ?? ""}
                placeholder="/images/… or https://…"
              />
            </label>
            <label className={styles.full}>
              Tags, comma-separated
              <input name="tags" defaultValue={editing?.tags.join(", ")} />
            </label>
            <label>
              Human reviewer
              <input
                name="reviewer_name"
                defaultValue={editing?.reviewer_name}
              />
            </label>
            <label>
              Reviewer evidence URL
              <input
                name="reviewer_proof_url"
                type="url"
                defaultValue={editing?.reviewer_proof_url ?? ""}
                placeholder="https://…"
              />
            </label>
            <label className={styles.full}>
              Why this reviewer is qualified
              <textarea
                name="reviewer_qualification"
                defaultValue={editing?.reviewer_qualification}
              />
            </label>
            <label className={styles.full}>
              Research and verification method
              <textarea
                name="methodology"
                defaultValue={editing?.methodology}
              />
            </label>
            <label className={styles.full}>
              Material limitations
              <textarea
                name="limitations"
                defaultValue={editing?.limitations}
              />
            </label>
            <label className={styles.full}>
              Conflicts / commercial-interest disclosure
              <textarea
                name="conflicts_disclosure"
                defaultValue={editing?.conflicts_disclosure}
              />
            </label>
            <label className={styles.full}>
              Primary or authoritative source URLs, one per line
              <textarea
                name="source_urls"
                rows={6}
                defaultValue={editing?.source_urls.join("\n")}
                placeholder={
                  "https://official-source.example/one\nhttps://official-source.example/two\nhttps://official-source.example/three"
                }
              />
            </label>
            <label>
              Status
              <select name="status" defaultValue={editing?.status ?? "draft"}>
                <option>draft</option>
                <option>review</option>
                <option>published</option>
                <option>archived</option>
              </select>
            </label>
            <label className={styles.checkbox}>
              <input
                name="featured"
                type="checkbox"
                defaultChecked={editing?.featured}
              />
              Feature this article
            </label>
            <label className={styles.checkbox}>
              <input
                name="requires_regulatory_review"
                type="checkbox"
                defaultChecked={editing?.requires_regulatory_review ?? true}
              />
              Contains financial, legal, tax, or regulatory claims
            </label>
            <label className={`${styles.checkbox} ${styles.full}`}>
              <input name="editorial_verified" type="checkbox" />I personally
              checked the sources, byline evidence, reviewer evidence, material
              claims, limitations, and disclosures for this version.
            </label>
            <button disabled={saving}>
              <Send size={16} />
              {saving ? "SAVING…" : editing ? "UPDATE ARTICLE" : "SAVE ARTICLE"}
            </button>
          </form>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>03 / LIBRARY</p>
              <h2>ARTICLES</h2>
            </div>
          </div>
          <div className={styles.list}>
            {blogs.map((blog) => (
              <article key={blog.id}>
                <div>
                  <strong>{blog.title}</strong>
                  <span>{blog.slug}</span>
                </div>
                <div>
                  <code>{blog.status}</code>
                  <small>
                    {blog.publication_mode === "automated"
                      ? "AI reviewed — no human review"
                      : "Human editorial route"}
                  </small>
                  <small>
                    {new Date(blog.updated_at).toLocaleDateString("en-IN")}
                  </small>
                  <button
                    className={styles.editButton}
                    type="button"
                    onClick={() => {
                      setEditing(blog);
                      window.scrollTo({ top: 500, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>04 / AUDIT</p>
            <h2>DATABASE ACTIVITY</h2>
          </div>
          <span>
            Application-level events. Supabase Auth audit events remain in the
            Supabase dashboard.
          </span>
        </div>
        <div className={styles.logGrid}>
          {audit.map((event) => (
            <article key={event.id}>
              <time>{new Date(event.created_at).toLocaleString("en-IN")}</time>
              <strong>{event.action}</strong>
              <span>
                {event.entity_type} / {event.entity_id ?? "system"}
              </span>
              {event.changed_fields.length > 0 && (
                <code>{event.changed_fields.join(", ")}</code>
              )}
              <details>
                <summary>Metadata</summary>
                <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
              </details>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
