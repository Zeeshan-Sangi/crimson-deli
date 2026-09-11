import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import StaffWorkspace from "@/components/portal/StaffWorkspace";
import { requirePageRole } from "@/lib/auth/current-user";
import { listUsers } from "@/lib/auth/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Staff · Admin" };

export default async function AdminStaffPage() {
  const user = await requirePageRole(["admin"]);
  const users = await listUsers();

  return (
    <PortalShell
      user={user}
      title="Staff accounts"
      subtitle="Who can sign in, and what they can reach."
    >
      <StaffWorkspace
        currentUserId={user.id}
        users={users.map(({ passwordHash, ...rest }) => rest)}
      />
    </PortalShell>
  );
}
