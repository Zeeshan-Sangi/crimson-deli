import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import SettingsWorkspace from "@/components/portal/SettingsWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getSettings, storeOpenState } from "@/lib/settings/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Settings · Admin" };

export default async function AdminSettingsPage() {
  const user = (await getCurrentUser())!;
  const settings = await getSettings();
  const open = storeOpenState(settings);

  return (
    <PortalShell
      user={user}
      title="Store settings"
      subtitle={
        open.open
          ? "Accepting orders right now."
          : open.reason === "paused"
            ? "Orders are paused."
            : `Closed right now${open.nextOpen ? `, reopening ${open.nextOpen}` : ""}.`
      }
    >
      <SettingsWorkspace initial={settings} canEdit={user.role === "admin"} />
    </PortalShell>
  );
}
