import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import EssentialsWorkspace from "@/components/portal/EssentialsWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { convenienceCategories, getCatalog } from "@/lib/data/convenience";
import { hiddenEssentialSlugs } from "@/lib/products/essentials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Everyday essentials · Admin" };

export default async function AdminEssentialsPage() {
  const user = (await getCurrentUser())!;
  const [{ products }, hidden] = await Promise.all([
    getCatalog(),
    hiddenEssentialSlugs(),
  ]);

  return (
    <PortalShell
      user={user}
      title="Everyday essentials"
      subtitle="What the shop stocks. Switch off anything we do not carry and it comes off the site immediately."
    >
      <EssentialsWorkspace
        products={products}
        categories={convenienceCategories.map((c) => ({ slug: c.slug, name: c.name }))}
        hidden={[...hidden]}
        canEdit={user.role === "admin"}
      />
    </PortalShell>
  );
}
