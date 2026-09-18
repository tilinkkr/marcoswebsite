"use client";
import { useState } from "react";
import { z } from "zod";
import styles from "@/app/public-pages.module.css";
const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  topic: z.string().min(2),
  message: z.string().min(20).max(4000),
});
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if (!schema.safeParse(payload).success) {
      setError(
        "Please check the required fields and add a little more detail.",
      );
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      setState("success");
    } catch {
      setState("idle");
      setError(
        "The form is temporarily unavailable. Please use the WhatsApp button.",
      );
    }
  }
  if (state === "success")
    return (
      <div className={styles.success} role="status">
        <strong>MESSAGE RECEIVED.</strong>
        <p>Thank you. Your message is now with the MARCOS team.</p>
      </div>
    );
  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" />
      </div>
      <div className={styles.field}>
        <label htmlFor="topic">Topic</label>
        <select id="topic" name="topic" defaultValue="" required>
          <option value="" disabled>
            Select a topic
          </option>
          {[
            "General",
            "Membership",
            "Indicators",
            "Partnership",
            "Team",
            "Technical Support",
            "Other",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div
        className={styles.fieldFull}
        aria-hidden
        style={{ position: "absolute", left: "-9999px" }}
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          minLength={20}
          maxLength={4000}
          required
        />
      </div>
      <div className={styles.fieldFull}>
        <button className={styles.submit} disabled={state === "sending"}>
          {state === "sending" ? "SENDING…" : "SEND MESSAGE →"}
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
