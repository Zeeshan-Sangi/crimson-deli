import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import {
  ProductError,
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "@/lib/products/store";
import { writeAudit } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  return NextResponse.json({ products: await listProducts() });
}

/**
 * Staff may only flip availability (the sold-out toggle CLAUDE.md §4 allows);
 * everything else is admin-only.
 */
export async function PATCH(request: Request) {
  let actor;
  try {
    actor = await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as { slug?: string } & Record<string, unknown>;
    if (!body.slug) return NextResponse.json({ error: "Missing product." }, { status: 400 });

    const { slug, ...patch } = body;
    const editsBeyondAvailability = Object.keys(patch).some((k) => k !== "available");
    if (editsBeyondAvailability && actor.role !== "admin") {
      return NextResponse.json(
        { error: "Staff can only change availability." },
        { status: 403 },
      );
    }

    const product = await updateProduct(slug, patch);
    await writeAudit({
      action: "product.update",
      entity: { type: "product", id: product.slug, label: product.name },
      actor,
      note: Object.keys(patch).join(", "),
    });
    return NextResponse.json({ product });
  } catch (err) {
    if (err instanceof ProductError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[products] update failed", err);
    return NextResponse.json({ error: "Could not save the product." }, { status: 500 });
  }
}

/** Adds a product to the catalogue. Admin only — this changes what customers see. */
export async function POST(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      price?: string;
      categorySlug?: string;
      imageUrl?: string;
    };

    const product = await createProduct({
      name: body.name ?? "",
      description: body.description,
      price: body.price,
      categorySlug: body.categorySlug ?? "",
      imageUrl: body.imageUrl,
    });

    await writeAudit({
      action: "product.create",
      entity: { type: "product", id: product.slug, label: product.name },
      actor,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    if (err instanceof ProductError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[products] create failed", err);
    return NextResponse.json({ error: "Could not add the product." }, { status: 500 });
  }
}

/** Permanently removes a product. Admin only. */
export async function DELETE(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as { slug?: string };
    if (!body.slug) return NextResponse.json({ error: "Missing product." }, { status: 400 });

    const product = await deleteProduct(body.slug);
    await writeAudit({
      action: "product.delete",
      entity: { type: "product", id: product.slug, label: product.name },
      actor,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ProductError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[products] delete failed", err);
    return NextResponse.json({ error: "Could not remove the product." }, { status: 500 });
  }
}
