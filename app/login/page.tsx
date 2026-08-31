import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Crimson Deli account.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "admin" ? "/admin" : user.role === "staff" ? "/team" : "/account");
  }

  return (
    <AuthShell
      title="Welcome back!"
      footer={
        <p className="auth-footnote">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
