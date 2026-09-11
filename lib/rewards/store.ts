import { randomUUID } from "node:crypto";
import type { Transaction } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { userRef } from "@/lib/auth/store";
import type { User } from "@/lib/auth/types";
import type { PointsEntry } from "./types";

/**
 * Reward points.
 *
 * The balance lives on the user and every change is written beside it in the
 * ledger, in the same transaction. A customer who asks where their points went
 * can be answered, and a balance that drifts from the ledger is a bug rather
 * than something nobody can see.
 */
const LEDGER = "pointsLedger";

function ledger() {
  return getAdminDb().collection(LEDGER);
}

export async function getBalance(uid: string): Promise<number> {
  const doc = await userRef(uid).get();
  if (!doc.exists) return 0;
  return Math.max(0, Math.floor((doc.data() as User).points ?? 0));
}

/** A customer's own point history, newest first. */
export async function listLedger(uid: string, limit = 12): Promise<PointsEntry[]> {
  // Sorted in memory so this needs no composite index; one customer's history
  // stays small, and only the newest entries are ever shown.
  const snap = await ledger().where("uid", "==", uid).get();
  return snap.docs
    .map((d) => d.data() as PointsEntry)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

/**
 * Moves a balance inside a caller's transaction.
 *
 * Both callers are already in one — an order being placed, or one being marked
 * picked up — and points have to move or not move with that order, never on
 * their own. The user document must have been read by the same transaction
 * first, which Firestore requires and which also means the balance being
 * written is the one that was checked.
 */
export function movePointsInTransaction(
  tx: Transaction,
  input: {
    uid: string;
    currentPoints: number;
    delta: number;
    reason: PointsEntry["reason"];
    orderId: string | null;
    orderNumber: string | null;
    at: string;
  },
): number {
  const balanceAfter = Math.max(0, Math.floor(input.currentPoints + input.delta));
  tx.set(userRef(input.uid), { points: balanceAfter }, { merge: true });

  const entry: PointsEntry = {
    id: randomUUID(),
    uid: input.uid,
    delta: input.delta,
    balanceAfter,
    reason: input.reason,
    orderId: input.orderId,
    orderNumber: input.orderNumber,
    at: input.at,
  };
  tx.set(ledger().doc(entry.id), entry);
  return balanceAfter;
}
