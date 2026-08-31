"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <FirebaseAuthButtons phoneLayout="full" onError={setError} />

      <div className="auth-divider">
        <span>Or sign up with email</span>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />

        <input
          type="tel"
          className="auth-input"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
        />

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-footnote">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
