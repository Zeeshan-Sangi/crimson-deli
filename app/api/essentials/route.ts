import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import { getCatalog } from "@/lib/data/convenience";
import { setEssentialHidden } from "@/lib/products/essentials";
import { writeAudit } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/**
 * Hides or restores one everyday essential.
 *
 * Admin only: this changes what customers see on /store, so it sits with the
 * fresh-food `hidden` flag rather than with the sold-out toggle staff may flip.
 */
export async function PATCH(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as { slug?: string; hidden?: boolean };
    if (!body.slug) return NextResponse.json({ error: "Missing item." }, { status: 400 });
    if (typeof body.hidden !== "boolean")
      return NextResponse.json({ error: "Missing hidden flag." }, { status: 400 });

    // The catalogue is the source of truth for what can be hidden — a slug that
    // is not in it would sit in the list forever with nothing to switch back on.
    const { products } = await getCatalog();
    const product = products.find((p) => p.slug === body.slug);
    if (!product)
      return NextResponse.json({ error: "No such item in the catalog." }, { status: 400 });

    await setEssentialHidden(product.slug, body.hidden);
    await writeAudit({
      action: "essential.update",
      entity: { type: "product", id: product.slug, label: product.name },
      actor,
      note: body.hidden ? "not carried" : "back on the shelf",
    });

    return NextResponse.json({ ok: true, slug: product.slug, hidden: body.hidden });
  } catch (err) {
    console.error("[essentials] update failed", err);
    return NextResponse.json({ error: "Could not save the change." }, { status: 500 });
  }
}
