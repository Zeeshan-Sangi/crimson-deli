import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { peekResetToken } from "@/lib/auth/reset-tokens";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Crimson Deli account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  // Checked here so a dead link says so immediately, rather than after the
  // visitor has typed a password twice. The API re-checks on submit — this is
  // a courtesy, not the guard.
  const valid = token ? await peekResetToken(token) : false;

  if (!valid) {
    return (
      <AuthShell title="Link expired">
        <div className="auth-sent">
          <p>
            This reset link has expired or has already been used. Reset links last
            one hour and work once.
          </p>
          <Link href="/forgot-password" className="auth-submit auth-submit--link">
            Send a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="New password"
      footer={
        <p className="auth-footnote">
          Remembered it? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
