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

    // Points are money. A negative rate would pay customers to order and a
    // zero redemption rate would make a balance unspendable, so both are
    // refused rather than clamped quietly.
    const rewards = body.rewards ?? current.rewards;
    const perDollar = Number(rewards.pointsPerDollar);
    const perDollarOff = Number(rewards.pointsPerDollarOff);
    const minRedeem = Number(rewards.minRedeemPoints);
    if (!Number.isFinite(perDollar) || perDollar < 0 || perDollar > 1000) {
      return NextResponse.json(
        { error: "Points per dollar must be between 0 and 1000." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(perDollarOff) || perDollarOff < 1 || perDollarOff > 100000) {
      return NextResponse.json(
        { error: "Points for a dollar off must be at least 1." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(minRedeem) || minRedeem < 0 || minRedeem > 100000) {
      return NextResponse.json(
        { error: "Minimum redemption must be between 0 and 100000 points." },
        { status: 400 },
      );
    }

    const next: Settings = {
      store: { ...current.store, ...body.store, prepTimeMinutes: Math.round(prep) },
      rewards: {
        enabled: Boolean(rewards.enabled),
        pointsPerDollar: Math.round(perDollar),
        pointsPerDollarOff: Math.round(perDollarOff),
        minRedeemPoints: Math.round(minRedeem),
      },
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
