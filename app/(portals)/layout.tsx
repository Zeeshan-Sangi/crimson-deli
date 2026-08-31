import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import "./portal.css";

/**
 * Every portal page runs behind a session. Middleware redirects unauthenticated
 * requests already; this is the second check, so a page can never render for a
 * signed-out visitor even if it is reached some other way.
 */
export default async function PortalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return children;
}
