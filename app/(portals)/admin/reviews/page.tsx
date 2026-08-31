import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";
import ReviewsWorkspace from "@/components/portal/ReviewsWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listProducts } from "@/lib/products/store";
import { listAllReviews } from "@/lib/reviews/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Reviews · Admin" };

export default async function AdminReviewsPage() {
  const user = (await getCurrentUser())!;
  const [reviews, products] = await Promise.all([listAllReviews(), listProducts()]);

  const productNames = Object.fromEntries(products.map((p) => [p.slug, p.name]));

  return (
    <PortalShell
      user={user}
      title="Customer reviews"
      subtitle="Everything customers have said about the fresh food menu. Removing one takes it off the site immediately."
    >
      <ReviewsWorkspace reviews={reviews} productNames={productNames} />
    </PortalShell>
  );
}
