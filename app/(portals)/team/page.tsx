import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import TeamBoard from "@/components/portal/TeamBoard";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Live board" };

export default async function TeamPage() {
  const user = (await getCurrentUser())!;
  return (
    <PortalShell
      user={user}
      title="Live board"
      subtitle="Today's pickup orders. One tap moves an order along; refreshes every 10 seconds."
    >
      <TeamBoard />
    </PortalShell>
  );
}
