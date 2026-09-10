"use client";

import { useState } from "react";
import { z } from "zod";

import styles from "@/app/public-pages.module.css";
import { getPublicApiUrl } from "@/lib/api";

const schema = z.object({
  full_name: z.string().min(2),
  email: z.email(),
  mobile: z.string().min(7),
  location: z.string().min(2),
  area: z.string().min(2),
  why_marcos: z.string().min(30),
  contribution: z.string().min(30),
  portfolio_url: z.string().optional(),
});

export function TeamApplicationForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      setError("Please complete every required field with enough detail.");
      return;
    }
    setState("sending");
    try {
      const apiUrl = getPublicApiUrl();
      if (!apiUrl) {
        throw new Error("Application service is not configured");
      }
      const response = await fetch(`${apiUrl}/api/v1/team-applications`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
      setError(
        "Applications are temporarily unavailable. Please contact MARCOS on WhatsApp.",
      );
    }
  }
  if (state === "success")
    return (
      <div className={styles.success} role="status">
        <strong>REQUEST RECEIVED.</strong>
        <p>
          We&apos;ll review your submission and contact you if there&apos;s a
          relevant fit.
        </p>
      </div>
    );
  return (
    <form
      className={styles.form}
      onSubmit={submit}
      encType="multipart/form-data"
    >
      {[
        ["full_name", "Full name", "text"],
        ["email", "Email", "email"],
        ["mobile", "Mobile / WhatsApp", "tel"],
        ["location", "Location", "text"],
      ].map(([name, label, type]) => (
        <div className={styles.field} key={name}>
          <label htmlFor={name}>{label}</label>
          <input id={name} name={name} type={type} required />
        </div>
      ))}
      <div className={styles.field}>
        <label htmlFor="area">Area of interest</label>
        <select id="area" name="area" required defaultValue="">
          <option value="" disabled>
            Select an area
          </option>
          {[
            "Trading",
            "Content",
            "Technology",
            "Design",
            "Operations",
            "Community",
            "Partnerships",
            "Other",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="portfolio_url">
          Portfolio / LinkedIn / GitHub / social link
        </label>
        <input id="portfolio_url" name="portfolio_url" type="url" />
      </div>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="why_marcos">Why do you want to work with MARCOS?</label>
        <textarea id="why_marcos" name="why_marcos" required minLength={30} />
      </div>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="contribution">What can you contribute?</label>
        <textarea
          id="contribution"
          name="contribution"
          required
          minLength={30}
        />
      </div>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="resume">CV / resume (optional)</label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <span className={styles.help}>PDF, DOC or DOCX. Maximum 5 MB.</span>
      </div>
      <div className={styles.fieldFull}>
        <button className={styles.submit} disabled={state === "sending"}>
          {state === "sending" ? "SENDING…" : "SEND REQUEST →"}
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
