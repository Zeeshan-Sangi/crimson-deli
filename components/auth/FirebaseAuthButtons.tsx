"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { completeFirebaseSignIn, homeForRole } from "./firebase-session";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C12.655 15.108 15.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.978 13.409-5.192l-6.19-5.238C33.864 35.091 31.205 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 17.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.022 35.026 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

type FirebaseAuthButtonsProps = {
  next?: string;
  onError?: (message: string | null) => void;
};

/**
 * Google sign-in.
 *
 * Phone sign-in used to sit beside it and is gone: Firebase bills SMS on the
 * paid plan, and the store does not need it. Its number matching was also a
 * second way into an account, since numbers get recycled.
 */
export default function FirebaseAuthButtons({
  next = "",
  onError,
}: FirebaseAuthButtonsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const configured = isFirebaseClientConfigured();

  async function onGoogle() {
    if (!configured) {
      onError?.("Google sign-in is not configured yet.");
      return;
    }
    const auth = getClientAuth();
    if (!auth) {
      onError?.("Firebase Auth is not available.");
      return;
    }

    setBusy(true);
    onError?.(null);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      const session = await completeFirebaseSignIn(idToken);
      if (!session.ok || !session.user) {
        // The server refuses a staff account or an unverified address by name,
        // so its wording is shown rather than a generic failure.
        onError?.(session.error ?? "Could not sign in.");
        return;
      }
      router.push(homeForRole(session.user.role, next));
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request")
        return;
      if (code === "auth/unauthorized-domain") {
        onError?.("This site is not on the Firebase authorised domains list.");
        return;
      }
      if (code === "auth/popup-blocked") {
        onError?.("Your browser blocked the sign-in window. Allow pop-ups and try again.");
        return;
      }
      console.error("[google-auth] sign-in failed", err);
      onError?.("Google sign-in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-social">
      <button
        type="button"
        className="auth-social__btn"
        onClick={onGoogle}
        disabled={busy || !configured}
        title={configured ? undefined : "Add Firebase keys to enable Google sign-in."}
      >
        <GoogleIcon />
        {busy ? "Signing in…" : "Continue with Google"}
      </button>
    </div>
  );
}
