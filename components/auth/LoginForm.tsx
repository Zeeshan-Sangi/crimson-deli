"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";
import { homeForRole } from "./firebase-session";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not sign in.");
        return;
      }
      router.push(homeForRole(data.user.role, next));
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          autoFocus
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <div className="auth-forgot">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="auth-divider">
        <span>Or</span>
      </div>

      <FirebaseAuthButtons next={next} onError={setError} />

      {error && (
        <p className="auth-error auth-error--below" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
