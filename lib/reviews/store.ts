import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { MAX_RATING, MIN_RATING, type Review, type ReviewSummary } from "./types";

/**
 * Customer reviews — interim JSON storage, same shape as the other stores and
 * with the same caveat: a file does not survive serverless hosting. Firestore
 * replaces the IO below without changing a single caller.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "reviews.json");

const MAX_NAME = 60;
const MAX_BODY = 1500;

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export class ReviewError extends Error {}

async function readAll(): Promise<Review[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Review[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(reviews: Review[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(reviews, null, 2), "utf8");
}

/** Every review, newest first — the admin moderation list. */
export async function listAllReviews(): Promise<Review[]> {
  const all = await readAll();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Newest first — what the product page lists. */
export async function listForProduct(productSlug: string): Promise<Review[]> {
  const all = await readAll();
  return all
    .filter((r) => r.productSlug === productSlug)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function summaryForProduct(productSlug: string): Promise<ReviewSummary> {
  const reviews = await listForProduct(productSlug);
  const distribution = [0, 0, 0, 0, 0];
  for (const r of reviews) distribution[r.rating - 1] += 1;

  if (reviews.length === 0) return { count: 0, average: null, distribution };

  const total = reviews.reduce((n, r) => n + r.rating, 0);
  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
    distribution,
  };
}

/** Summaries for many products at once, so a listing page reads the file once. */
export async function summariesBySlug(): Promise<Record<string, ReviewSummary>> {
  const all = await readAll();
  const bySlug: Record<string, Review[]> = {};
  for (const r of all) (bySlug[r.productSlug] ??= []).push(r);

  const out: Record<string, ReviewSummary> = {};
  for (const [slug, reviews] of Object.entries(bySlug)) {
    const distribution = [0, 0, 0, 0, 0];
    for (const r of reviews) distribution[r.rating - 1] += 1;
    const total = reviews.reduce((n, r) => n + r.rating, 0);
    out[slug] = {
      count: reviews.length,
      average: Math.round((total / reviews.length) * 10) / 10,
      distribution,
    };
  }
  return out;
}

export async function createReview(input: {
  productSlug: string;
  name: string;
  rating: number;
  body: string;
}): Promise<Review> {
  const name = input.name.trim();
  const body = input.body.trim();
  const rating = Math.round(Number(input.rating));

  if (!name) throw new ReviewError("Please add your name.");
  if (name.length > MAX_NAME)
    throw new ReviewError(`Name must be under ${MAX_NAME} characters.`);
  if (!Number.isFinite(rating) || rating < MIN_RATING || rating > MAX_RATING)
    throw new ReviewError("Please choose a rating from 1 to 5 stars.");
  if (!body) throw new ReviewError("Please write a few words about the item.");
  if (body.length > MAX_BODY)
    throw new ReviewError(`Review must be under ${MAX_BODY} characters.`);

  const review: Review = {
    id: randomUUID(),
    productSlug: input.productSlug,
    name,
    rating,
    body,
    createdAt: new Date().toISOString(),
  };

  return serialise(async () => {
    const all = await readAll();
    await writeAll([review, ...all]);
    return review;
  });
}

/** Moderation: staff remove a review that should not be on the site. */
export async function deleteReview(id: string): Promise<Review> {
  return serialise(async () => {
    const all = await readAll();
    const i = all.findIndex((r) => r.id === id);
    if (i === -1) throw new ReviewError("Review not found.");
    const [removed] = all.splice(i, 1);
    await writeAll(all);
    return removed;
  });
}
