export async function completeFirebaseSignIn(idToken: string): Promise<{
  ok: boolean;
  user?: { name: string; email: string; role: string };
  error?: string;
}> {
  const res = await fetch("/api/auth/firebase", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error ?? "Could not sign in." };
  return { ok: true, user: data.user };
}

export function homeForRole(role: string, next: string): string {
  if (next) return next;
  if (role === "admin") return "/admin";
  if (role === "staff") return "/team";
  return "/account";
}
