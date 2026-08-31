import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import { writeAudit } from "@/lib/audit/log";
import { getProduct } from "@/lib/products/store";
import {
  ReviewError,
  createReview,
  deleteReview,
  listForProduct,
  summaryForProduct,
} from "@/lib/reviews/store";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/** Public: the reviews shown on a product page. */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return NextResponse.json({ error: "Missing product." }, { status: 400 });

  const [reviews, summary] = await Promise.all([
    listForProduct(slug),
    summaryForProduct(slug),
  ]);
  return NextResponse.json({ reviews, summary });
}

/** Public: leave a review. Rate limited — this endpoint takes anonymous writes. */
export async function POST(request: Request) {
  let body: { productSlug?: string; name?: string; rating?: number; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`review:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That's a lot of reviews at once. Try again a bit later." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  const slug = body.productSlug?.trim() ?? "";
  // Reviews may only attach to a product that exists, or the store fills up
  // with rows pointing at nothing.
  const product = await getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Unknown item." }, { status: 400 });
  }

  try {
    const review = await createReview({
      productSlug: slug,
      name: body.name ?? "",
      rating: Number(body.rating),
      body: body.body ?? "",
    });
    const summary = await summaryForProduct(slug);
    return NextResponse.json({ review, summary }, { status: 201 });
  } catch (err) {
    if (err instanceof ReviewError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[reviews] create failed", err);
    return NextResponse.json({ error: "Could not save your review." }, { status: 500 });
  }
}

/** Moderation. Staff and admins can take a review down. */
export async function DELETE(request: Request) {
  let actor;
  try {
    actor = await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) return NextResponse.json({ error: "Missing review." }, { status: 400 });

    const review = await deleteReview(id);
    await writeAudit({
      action: "review.delete",
      entity: { type: "product", id: review.productSlug, label: review.name },
      actor,
      note: `${review.rating}★`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ReviewError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[reviews] delete failed", err);
    return NextResponse.json({ error: "Could not remove the review." }, { status: 500 });
  }
}
