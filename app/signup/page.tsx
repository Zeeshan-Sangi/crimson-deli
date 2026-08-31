import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Crimson Deli customer account.",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "admin" ? "/admin" : user.role === "staff" ? "/team" : "/account");
  }

  return (
    <AuthShell title="Create your account">
      <SignupForm />
    </AuthShell>
  );
}
