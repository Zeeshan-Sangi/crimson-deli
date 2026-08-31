import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import MessagesWorkspace from "@/components/portal/MessagesWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listMessages } from "@/lib/messages/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages · Admin" };

export default async function AdminMessagesPage() {
  const user = (await getCurrentUser())!;
  const messages = await listMessages();

  return (
    <PortalShell
      user={user}
      title="Contact messages"
      subtitle="Everything sent from the contact form. Mark a message handled once you've replied or called back."
    >
      <MessagesWorkspace messages={messages} />
    </PortalShell>
  );
}
