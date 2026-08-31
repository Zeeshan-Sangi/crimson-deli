"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
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

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 2h3l1.2 5.1a1 1 0 0 1-.5 1.1l-2.1 1.2a12 12 0 0 0 5.7 5.7l1.2-2.1a1 1 0 0 1 1.1-.5L19 13v3a2 2 0 0 1-2 2C9.6 18 6 14.4 6 8.5A2 2 0 0 1 8 6.5Z"
        stroke="#111"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Turns a Firebase auth error into a message that names the actual cause.
 *
 * The catch-all "check the number" text was actively misleading: a blocked SMS
 * region, an unauthorised domain and a bad reCAPTCHA all look identical to the
 * person typing, and none of them are fixed by re-checking the number.
 */
function phoneErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  const raw =
    typeof err === "object" && err !== null && "message" in err
      ? String((err as { message: unknown }).message)
      : "";

  if (raw.includes("region enabled") || code === "auth/invalid-app-credential") {
    if (raw.includes("region enabled")) {
      return "Text messages are not enabled for this country yet. The store needs to allow this region in Firebase before phone sign-in works.";
    }
    return "Phone sign-in could not verify this browser. Reload the page and try again.";
  }
  if (code === "auth/billing-not-enabled")
    return "Phone sign-in needs billing enabled on the Firebase project.";
  if (code === "auth/invalid-phone-number")
    return "That phone number does not look right. Include the country code, e.g. +1 215 555 0123.";
  if (code === "auth/too-many-requests")
    return "Too many attempts from this device. Wait a few minutes and try again.";
  if (code === "auth/unauthorized-domain")
    return "This site is not on the Firebase authorised domains list.";
  if (code === "auth/quota-exceeded")
    return "The daily SMS limit has been reached. Try again tomorrow or sign in another way.";

  return "Could not send the verification code. Please try another sign-in method.";
}

function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.trim().startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

type FirebaseAuthButtonsProps = {
  next?: string;
  phoneLayout?: "row" | "full";
  onError?: (message: string | null) => void;
};

export default function FirebaseAuthButtons({
  next = "",
  phoneLayout = "row",
  onError,
}: FirebaseAuthButtonsProps) {
  const router = useRouter();
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const configured = isFirebaseClientConfigured();

  useEffect(() => {
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  function reportError(message: string) {
    onError?.(message);
  }

  async function finishWithToken(idToken: string) {
    const result = await completeFirebaseSignIn(idToken);
    if (!result.ok || !result.user) {
      reportError(result.error ?? "Could not sign in.");
      return;
    }
    router.push(homeForRole(result.user.role, next));
    router.refresh();
  }

  async function onGoogle() {
    if (!configured) {
      reportError("Google sign-in is not configured yet.");
      return;
    }
    const auth = getClientAuth();
    if (!auth) {
      reportError("Firebase Auth is not available.");
      return;
    }
    setBusy(true);
    onError?.(null);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      await finishWithToken(idToken);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user") return;
      reportError("Google sign-in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function ensureRecaptcha(auth: NonNullable<ReturnType<typeof getClientAuth>>) {
    if (recaptchaRef.current) return recaptchaRef.current;
    recaptchaRef.current = new RecaptchaVerifier(auth, "firebase-recaptcha", {
      size: "invisible",
    });
    return recaptchaRef.current;
  }

  async function sendCode() {
    if (!configured) {
      reportError("Phone sign-in is not configured yet.");
      return;
    }
    const auth = getClientAuth();
    if (!auth) {
      reportError("Firebase Auth is not available.");
      return;
    }
    const e164 = toE164(phone);
    if (!e164) {
      reportError(
        "Enter a valid phone number — a 10-digit US number, or include the country code like +92 317 6293902.",
      );
      return;
    }

    setBusy(true);
    onError?.(null);
    try {
      const verifier = ensureRecaptcha(auth);
      confirmationRef.current = await signInWithPhoneNumber(auth, e164, verifier);
      setCodeSent(true);
    } catch (err) {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      // Logged as well as shown: the console line is what an operator needs to
      // find the setting to change.
      console.error("[phone-auth] sendVerificationCode failed", err);
      reportError(phoneErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (!confirmationRef.current) {
      reportError("Send a verification code first.");
      return;
    }
    if (!code.trim()) {
      reportError("Enter the verification code.");
      return;
    }

    setBusy(true);
    onError?.(null);
    try {
      const result = await confirmationRef.current.confirm(code.trim());
      const idToken = await result.user.getIdToken();
      await finishWithToken(idToken);
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code: unknown }).code)
          : "";
      reportError(
        code === "auth/code-expired"
          ? "That code has expired. Send a new one."
          : "That code is incorrect. Check it and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function openPhone() {
    setPhoneOpen(true);
    onError?.(null);
  }

  return (
    <>
      <div className={phoneLayout === "row" ? "auth-social" : "auth-social auth-social--stack"}>
        <button
          type="button"
          className={`auth-social__btn${phoneLayout === "full" ? " auth-social__btn--full" : ""}`}
          onClick={onGoogle}
          disabled={busy || !configured}
          title={configured ? undefined : "Add Firebase keys to enable Google sign-in."}
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className={`auth-social__btn${phoneLayout === "full" ? " auth-social__btn--full" : ""}`}
          onClick={openPhone}
          disabled={busy || !configured}
          title={configured ? undefined : "Add Firebase keys to enable phone sign-in."}
        >
          <PhoneIcon />
          Phone number
        </button>
      </div>

      <div id="firebase-recaptcha" className="auth-recaptcha" aria-hidden="true" />

      {phoneOpen && (
        <div className="auth-phone">
          <input
            type="tel"
            className="auth-input"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            disabled={busy || codeSent}
          />
          {codeSent && (
            <input
              type="text"
              className="auth-input"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={busy}
            />
          )}
          <button
            type="button"
            className="auth-submit auth-submit--secondary"
            onClick={codeSent ? verifyCode : sendCode}
            disabled={busy}
          >
            {busy
              ? "Please wait…"
              : codeSent
                ? "Verify & sign in"
                : "Send verification code"}
          </button>
        </div>
      )}

    </>
  );
}
