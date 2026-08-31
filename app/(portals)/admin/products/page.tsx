import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import ProductsWorkspace from "@/components/portal/ProductsWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { foodCategories, listProducts } from "@/lib/products/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Products · Admin" };

export default async function AdminProductsPage() {
  const user = (await getCurrentUser())!;
  const products = await listProducts();

  return (
    <PortalShell
      user={user}
      title="Fresh food products"
      subtitle="Prices, descriptions and what is sold out. Changes show on the site immediately."
    >
      <ProductsWorkspace
        products={products}
        categories={[...foodCategories]}
        canEdit={user.role === "admin"}
      />
    </PortalShell>
  );
}
