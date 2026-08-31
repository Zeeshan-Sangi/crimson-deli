import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Send yourself a link to reset your Crimson Deli password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password?"
      footer={
        <p className="auth-footnote">
          Remembered it? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
