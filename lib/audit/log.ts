import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SessionUser } from "@/lib/auth/types";

/**
 * Append-only trail of admin actions: who changed what, and when.
 *
 * Same interim storage as orders and users — a JSON file now, Firestore later.
 * A logging failure must never fail the mutation it describes, so every write
 * here is wrapped and swallowed.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "audit.json");
const MAX_ENTRIES = 2000;

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

async function readAll(): Promise<AuditEntry[]> {
  try {
    const raw = await readFile(LOG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export async function writeAudit(input: {
  action: string;
  entity: AuditEntity;
  actor: SessionUser;
  note?: string;
}): Promise<void> {
  try {
    const entries = await readAll();
    const entry: AuditEntry = {
      id: randomUUID(),
      at: new Date().toISOString(),
      action: input.action,
      entity: input.entity,
      actor: { id: input.actor.id, email: input.actor.email, name: input.actor.name },
      note: input.note,
    };
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(
      LOG_FILE,
      JSON.stringify([entry, ...entries].slice(0, MAX_ENTRIES), null, 2),
      "utf8",
    );
  } catch (err) {
    // Never let an audit failure break the action it describes.
    console.error("[audit] could not write entry", err);
  }
}

export async function listAudit(limit = 50): Promise<AuditEntry[]> {
  const entries = await readAll();
  return entries.slice(0, limit);
}
