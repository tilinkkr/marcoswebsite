"use client";

import { ExternalLink, LogOut, RefreshCw, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  status: string;
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

  async function createBlog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const payload = {
      slug: form.get("slug"),
      title: form.get("title"),
      excerpt: form.get("excerpt"),
      content_markdown: form.get("content_markdown"),
      hero_image: form.get("hero_image"),
      author_name: form.get("author_name"),
      status: form.get("status"),
      seo_title: form.get("seo_title"),
      seo_description: form.get("seo_description"),
      category: form.get("category"),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.get("featured") === "on",
      requires_regulatory_review: true,
      reading_time: Number(form.get("reading_time")),
      canonical_url: null,
      og_image: null,
    };
    const response = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => null);
    setNotice(
      response.ok
        ? "Article saved and the public insights page refreshed."
        : (body?.error ?? "Article could not be saved."),
    );
    setSaving(false);
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>MARCOS / CONTROL ROOM</p>
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
              <p className={styles.eyebrow}>02 / PUBLISH</p>
              <h2>NEW INSIGHT</h2>
            </div>
          </div>
          <form className={styles.editor} onSubmit={createBlog}>
            <label>
              Title
              <input name="title" minLength={8} required />
            </label>
            <label>
              Slug
              <input name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
            </label>
            <label>
              Category
              <input name="category" defaultValue="MARKET EDUCATION" required />
            </label>
            <label>
              Author
              <input
                name="author_name"
                defaultValue="MARCOS Editorial Desk"
                required
              />
            </label>
            <label className={styles.full}>
              Excerpt
              <textarea name="excerpt" minLength={30} required />
            </label>
            <label className={styles.full}>
              Article markdown
              <textarea
                name="content_markdown"
                minLength={100}
                rows={14}
                required
              />
            </label>
            <label className={styles.full}>
              Hero image path
              <input
                name="hero_image"
                defaultValue="/images/marcos/insights/prop-firm-rules-india-2026.webp"
                required
              />
            </label>
            <label>
              SEO title
              <input name="seo_title" minLength={8} required />
            </label>
            <label>
              Reading minutes
              <input
                name="reading_time"
                type="number"
                min="1"
                max="120"
                defaultValue="5"
                required
              />
            </label>
            <label className={styles.full}>
              SEO description
              <textarea
                name="seo_description"
                minLength={30}
                maxLength={320}
                required
              />
            </label>
            <label className={styles.full}>
              Tags, comma-separated
              <input name="tags" />
            </label>
            <label>
              Status
              <select name="status" defaultValue="draft">
                <option>draft</option>
                <option>review</option>
                <option>published</option>
              </select>
            </label>
            <label className={styles.checkbox}>
              <input name="featured" type="checkbox" />
              Feature this article
            </label>
            <button disabled={saving}>
              <Send size={16} />
              {saving ? "SAVING…" : "SAVE ARTICLE"}
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
                    {new Date(blog.updated_at).toLocaleDateString("en-IN")}
                  </small>
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
