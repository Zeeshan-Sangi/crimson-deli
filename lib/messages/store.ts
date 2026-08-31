import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import type { ContactMessage } from "./types";

const COLLECTION = "messages";

function col() {
  return getAdminDb().collection(COLLECTION);
}

const MAX_NAME = 80;
const MAX_SUBJECT = 140;
const MAX_BODY = 4000;

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export class MessageError extends Error {}

function toMessage(doc: FirebaseFirestore.QueryDocumentSnapshot): ContactMessage | null {
  const data = doc.data();
  if (data._seed === true) return null;
  return data as ContactMessage;
}

async function readAll(): Promise<ContactMessage[]> {
  const snap = await col().get();
  return snap.docs.map(toMessage).filter((m): m is ContactMessage => m !== null);
}

export async function listMessages(): Promise<ContactMessage[]> {
  const all = await readAll();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  body: string;
}): Promise<ContactMessage> {
  const name = input.name.trim();
  const email = input.email.trim();
  const body = input.body.trim();
  const phone = input.phone?.trim() || null;
  const subject = input.subject?.trim() || `Message from ${name}`;

  if (!name) throw new MessageError("Please tell us your name.");
  if (name.length > MAX_NAME) throw new MessageError("That name is too long.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new MessageError("Please enter a valid email address.");
  if (!body) throw new MessageError("Please write a message.");
  if (body.length > MAX_BODY) throw new MessageError("That message is too long.");
  if (subject.length > MAX_SUBJECT) throw new MessageError("That subject is too long.");

  const message: ContactMessage = {
    id: randomUUID(),
    name,
    email,
    phone,
    subject,
    body,
    handledAt: null,
    createdAt: new Date().toISOString(),
  };

  return serialise(async () => {
    await col().doc(message.id).set(message);
    return message;
  });
}

export async function setMessageHandled(
  id: string,
  handled: boolean,
): Promise<ContactMessage> {
  return serialise(async () => {
    const ref = col().doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new MessageError("Message not found.");
    const updated: ContactMessage = {
      ...(doc.data() as ContactMessage),
      handledAt: handled ? new Date().toISOString() : null,
    };
    await ref.set(updated);
    return updated;
  });
}

export async function deleteMessage(id: string): Promise<ContactMessage> {
  return serialise(async () => {
    const ref = col().doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new MessageError("Message not found.");
    const removed = doc.data() as ContactMessage;
    await ref.delete();
    return removed;
  });
}
