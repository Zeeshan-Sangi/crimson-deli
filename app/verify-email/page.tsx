import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify your Crimson Deli account email.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "admin" ? "/admin" : user.role === "staff" ? "/team" : "/account");
  }

  const params = await searchParams;
  const email = params.email?.trim() ?? "";

  return (
    <AuthShell title="Verify your email">
      <VerifyEmailForm defaultEmail={email} />
    </AuthShell>
  );
}
