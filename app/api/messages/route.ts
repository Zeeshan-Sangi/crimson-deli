import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import { writeAudit } from "@/lib/audit/log";
import {
  MessageError,
  createMessage,
  deleteMessage,
  listMessages,
  setMessageHandled,
} from "@/lib/messages/store";
import { clientIp, consume } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/** Staff read the inbox. */
export async function GET() {
  try {
    await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  return NextResponse.json({ messages: await listMessages() });
}

/** Public: the storefront contact form posts here. */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    body?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const ip = await clientIp();
  const limit = consume(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You've sent a few already. Please call the store instead." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  try {
    const message = await createMessage({
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone,
      subject: body.subject,
      body: body.body ?? "",
    });
    return NextResponse.json({ ok: true, id: message.id }, { status: 201 });
  } catch (err) {
    if (err instanceof MessageError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[messages] create failed", err);
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }
}

/** Staff mark a message handled. */
export async function PATCH(request: Request) {
  let actor;
  try {
    actor = await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  try {
    const { id, handled } = (await request.json()) as { id?: string; handled?: boolean };
    if (!id) return NextResponse.json({ error: "Missing message." }, { status: 400 });

    const message = await setMessageHandled(id, handled !== false);
    await writeAudit({
      action: message.handledAt ? "message.handled" : "message.reopened",
      entity: { type: "settings", id: message.id, label: message.name },
      actor,
    });
    return NextResponse.json({ message });
  } catch (err) {
    if (err instanceof MessageError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[messages] update failed", err);
    return NextResponse.json({ error: "Could not update the message." }, { status: 500 });
  }
}

/** Staff delete a message. */
export async function DELETE(request: Request) {
  let actor;
  try {
    actor = await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) return NextResponse.json({ error: "Missing message." }, { status: 400 });

    const message = await deleteMessage(id);
    await writeAudit({
      action: "message.delete",
      entity: { type: "settings", id: message.id, label: message.name },
      actor,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof MessageError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[messages] delete failed", err);
    return NextResponse.json({ error: "Could not remove the message." }, { status: 500 });
  }
}
