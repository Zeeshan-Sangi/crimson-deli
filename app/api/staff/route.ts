import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import { AuthError, createUser, listUsers, setUserDisabled, setUserPassword, setUserRole } from "@/lib/auth/store";
import { ROLES, type Role } from "@/lib/auth/types";
import { writeAudit } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

/** Admin-only. Middleware guards the pages; this guards the data. */
export async function GET() {
  try {
    await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }
  const users = await listUsers();
  // Never ship password hashes to the client.
  return NextResponse.json({
    users: users.map(({ passwordHash, ...rest }) => rest),
  });
}

export async function POST(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      role?: string;
      password?: string;
    };
    if (!body.role || !ROLES.includes(body.role as Role)) {
      return NextResponse.json({ error: "Unknown role." }, { status: 400 });
    }
    const user = await createUser({
      email: body.email ?? "",
      name: body.name ?? "",
      role: body.role as Role,
      password: body.password ?? "",
      trustedEmail: true,
    });
    await writeAudit({
      action: "staff.create",
      entity: { type: "user", id: user.id, label: user.email },
      actor,
      note: `role ${user.role}`,
    });
    const { passwordHash, ...safe } = user;
    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[staff] create failed", err);
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      role?: string;
      disabled?: boolean;
      password?: string;
    };
    if (!body.id) return NextResponse.json({ error: "Missing user." }, { status: 400 });

    if (body.role) {
      if (!ROLES.includes(body.role as Role)) {
        return NextResponse.json({ error: "Unknown role." }, { status: 400 });
      }
      const user = await setUserRole(body.id, body.role as Role);
      await writeAudit({
        action: "staff.role",
        entity: { type: "user", id: user.id, label: user.email },
        actor,
        note: `→ ${user.role}`,
      });
    }

    if (typeof body.disabled === "boolean") {
      const user = await setUserDisabled(body.id, body.disabled);
      await writeAudit({
        action: body.disabled ? "staff.disable" : "staff.enable",
        entity: { type: "user", id: user.id, label: user.email },
        actor,
      });
    }

    if (body.password) {
      await setUserPassword(body.id, body.password);
      await writeAudit({
        action: "staff.password",
        entity: { type: "user", id: body.id },
        actor,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[staff] update failed", err);
    return NextResponse.json({ error: "Could not update the account." }, { status: 500 });
  }
}
