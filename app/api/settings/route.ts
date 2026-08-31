import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/current-user";
import { getSettings, saveSettings, type Settings } from "@/lib/settings/store";
import { writeAudit } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["staff", "admin"]);
  } catch (res) {
    return res as Response;
  }
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(request: Request) {
  let actor;
  try {
    actor = await requireRole(["admin"]);
  } catch (res) {
    return res as Response;
  }

  try {
    const body = (await request.json()) as Settings;
    const current = await getSettings();

    const tax = Number(body.checkout?.taxRate);
    if (!Number.isFinite(tax) || tax < 0 || tax > 1) {
      return NextResponse.json(
        { error: "Tax rate must be between 0 and 1 (e.g. 0.08 for 8%)." },
        { status: 400 },
      );
    }
    const prep = Number(body.store?.prepTimeMinutes);
    if (!Number.isFinite(prep) || prep < 0 || prep > 240) {
      return NextResponse.json(
        { error: "Prep time must be between 0 and 240 minutes." },
        { status: 400 },
      );
    }

    const next: Settings = {
      store: { ...current.store, ...body.store, prepTimeMinutes: Math.round(prep) },
      checkout: {
        ...current.checkout,
        ...body.checkout,
        taxRate: tax,
        tipPresets: (body.checkout?.tipPresets ?? current.checkout.tipPresets)
          .map(Number)
          .filter((n) => Number.isFinite(n) && n >= 0 && n <= 100),
      },
    };

    await saveSettings(next);
    await writeAudit({
      action: "settings.update",
      entity: { type: "settings", id: "store" },
      actor,
    });
    return NextResponse.json({ settings: next });
  } catch (err) {
    console.error("[settings] save failed", err);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
