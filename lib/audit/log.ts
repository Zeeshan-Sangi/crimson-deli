import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import type { SessionUser } from "@/lib/auth/types";

const COLLECTION = "audit";

export type AuditEntity = {
  type: "order" | "product" | "user" | "settings";
  id: string;
  label?: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  action: string;
  entity: AuditEntity;
  actor: { id: string; email: string; name: string };
  note?: string;
};

function col() {
  return getAdminDb().collection(COLLECTION);
}

function toEntry(doc: FirebaseFirestore.QueryDocumentSnapshot): AuditEntry | null {
  const data = doc.data();
  if (data._seed === true) return null;
  return data as AuditEntry;
}

export async function writeAudit(input: {
  action: string;
  entity: AuditEntity;
  actor: SessionUser;
  note?: string;
}): Promise<void> {
  try {
    const entry: AuditEntry = {
      id: randomUUID(),
      at: new Date().toISOString(),
      action: input.action,
      entity: input.entity,
      actor: { id: input.actor.id, email: input.actor.email, name: input.actor.name },
      note: input.note,
    };
    await col().doc(entry.id).set(entry);
  } catch (err) {
    console.error("[audit] could not write entry", err);
  }
}

export async function listAudit(limit = 50): Promise<AuditEntry[]> {
  const snap = await col().orderBy("at", "desc").limit(limit).get();
  return snap.docs.map(toEntry).filter((e): e is AuditEntry => e !== null);
}
