import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";
import { DAYS, type Settings, type StoreSettings } from "./types";

/**
 * Store and checkout settings (CLAUDE.md §3).
 *
 * Nothing here may be hardcoded elsewhere — tax rate, tip presets, hours and
 * prep time all come from this store so the admin panel is the only place they
 * change.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "settings.json");

export {
  DAYS,
  type Day,
  type DayHours,
  type StoreSettings,
  type CheckoutSettings,
  type Settings,
} from "./types";

/** Hours as published on the About page: Sun 9am to 8:30pm, Mon-Sat 9am to 9:30pm. */
const DEFAULTS: Settings = {
  store: {
    hours: {
      mon: { open: "09:00", close: "21:30", closed: false },
      tue: { open: "09:00", close: "21:30", closed: false },
      wed: { open: "09:00", close: "21:30", closed: false },
      thu: { open: "09:00", close: "21:30", closed: false },
      fri: { open: "09:00", close: "21:30", closed: false },
      sat: { open: "09:00", close: "21:30", closed: false },
      sun: { open: "09:00", close: "20:30", closed: false },
    },
    timezone: "America/New_York",
    ordersPaused: false,
    prepTimeMinutes: 20,
    address: siteConfig.address,
    phone: siteConfig.phone,
    doordashStoreUrl: siteConfig.doordashUrl,
  },
  checkout: {
    // TODO: confirm the Philadelphia prepared-food rate with the client
    // (CLAUDE.md §11). 0 until then, so nothing is invented.
    taxRate: 0,
    taxAppliesTo: "food",
    taxIncludedInPrice: false,
    tipEnabled: false,
    tipPresets: [10, 15, 20],
    prepayRequiredAbove: null,
    phoneVerificationRequired: false,
  },
};

let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      store: { ...DEFAULTS.store, ...parsed.store },
      checkout: { ...DEFAULTS.checkout, ...parsed.checkout },
    };
  } catch {
    return DEFAULTS;
  }
}

export async function saveSettings(next: Settings): Promise<Settings> {
  return serialise(async () => {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
    return next;
  });
}

/** Minutes since midnight, from "HH:MM". */
function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export type OpenState = {
  open: boolean;
  reason: "open" | "paused" | "closed_today" | "outside_hours";
  /** Human-readable next opening, when closed. */
  nextOpen: string | null;
};

/** Whether the store is accepting orders right now, in its own timezone. */
export function storeOpenState(settings: Settings, now = new Date()): OpenState {
  const { store } = settings;
  if (store.ordersPaused) return { open: false, reason: "paused", nextOpen: null };

  const local = new Date(
    now.toLocaleString("en-US", { timeZone: store.timezone }),
  );
  // JS weeks start on Sunday; DAYS starts on Monday.
  const day = DAYS[(local.getDay() + 6) % 7];
  const today = store.hours[day];

  if (today.closed) {
    return { open: false, reason: "closed_today", nextOpen: nextOpening(store, local) };
  }

  const nowMin = local.getHours() * 60 + local.getMinutes();
  if (nowMin < minutes(today.open) || nowMin >= minutes(today.close)) {
    return { open: false, reason: "outside_hours", nextOpen: nextOpening(store, local) };
  }

  return { open: true, reason: "open", nextOpen: null };
}

function nextOpening(store: StoreSettings, local: Date): string | null {
  const nowMin = local.getHours() * 60 + local.getMinutes();
  for (let ahead = 0; ahead < 8; ahead++) {
    const idx = (local.getDay() + 6) % 7;
    const day = DAYS[(idx + ahead) % 7];
    const hours = store.hours[day];
    if (hours.closed) continue;
    if (ahead === 0 && nowMin >= minutes(hours.open)) continue;
    const label = ahead === 0 ? "today" : ahead === 1 ? "tomorrow" : day;
    return `${label} at ${hours.open}`;
  }
  return null;
}
