"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "../admin.module.css";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!result.ok) {
      setError("Invalid credentials or account unavailable.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className={styles.loginShell}>
      <form className={styles.loginCard} onSubmit={submit}>
        <LockKeyhole aria-hidden />
        <p className={styles.eyebrow}>MARCOS / RESTRICTED OPERATIONS</p>
        <h1>ADMIN ACCESS</h1>
        <p>Only the three approved MARCOS administrators can continue.</p>
        <label>
          Username
          <input
            type="text"
            autoComplete="username"
            inputMode="text"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button disabled={pending}>
          {pending ? "VERIFYING…" : "ENTER SECURE DESK"}
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
