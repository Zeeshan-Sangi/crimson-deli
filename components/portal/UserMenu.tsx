"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth/types";

export default function UserMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="crm-user">
      <span className="crm-user__avatar" aria-hidden="true">
        {initials}
      </span>
      <span className="crm-user__meta">
        <span className="crm-user__name">{user.name}</span>
        <span className="crm-user__role">{user.role}</span>
      </span>
      <button type="button" className="crm-user__logout" onClick={logout} disabled={busy}>
        {busy ? "…" : "Sign out"}
      </button>
    </div>
  );
}
