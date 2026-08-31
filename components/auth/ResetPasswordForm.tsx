"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordInput from "./PasswordInput";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not update your password.");
        return;
      }
      setDone(true);
      // Straight to sign-in, where the new password gets its first use.
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="auth-sent" role="status">
        <p>Password updated. Taking you to sign in…</p>
        <Link href="/login" className="auth-submit auth-submit--link">
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="auth-lede">Choose a new password for your account.</p>

      <form className="auth-form" onSubmit={onSubmit}>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="New password (min 8 characters)"
          autoComplete="new-password"
          required
          minLength={8}
        />

        <PasswordInput
          value={confirm}
          onChange={setConfirm}
          placeholder="Confirm new password"
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
          {busy ? "Saving…" : "Set new password"}
        </button>
      </form>
    </>
  );
}
