import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/lib/site-config";
import { DAYS, type Settings, type StoreSettings } from "./types";

/**
 * Store and checkout settings — single Firestore document at settings/default.
 */
const COLLECTION = "settings";
const DOC_ID = "default";

export {
  DAYS,
  type Day,
  type DayHours,
  type StoreSettings,
  type CheckoutSettings,
  type Settings,
} from "./types";

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

function docRef() {
  return getAdminDb().collection(COLLECTION).doc(DOC_ID);
}

function mergeWithDefaults(parsed: Partial<Settings> | undefined): Settings {
  return {
    store: { ...DEFAULTS.store, ...parsed?.store },
    checkout: { ...DEFAULTS.checkout, ...parsed?.checkout },
  };
}

export async function getSettings(): Promise<Settings> {
  const snap = await docRef().get();
  if (!snap.exists) {
    const settings = DEFAULTS;
    await docRef().set({ ...settings, updatedAt: new Date().toISOString() });
    return settings;
  }
  const data = snap.data() as Partial<Settings>;
  return mergeWithDefaults(data);
}

export async function saveSettings(next: Settings): Promise<Settings> {
  return serialise(async () => {
    await docRef().set({ ...next, updatedAt: new Date().toISOString() });
    return next;
  });
}

function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export type OpenState = {
  open: boolean;
  reason: "open" | "paused" | "closed_today" | "outside_hours";
  nextOpen: string | null;
};

export function storeOpenState(settings: Settings, now = new Date()): OpenState {
  const { store } = settings;
  if (store.ordersPaused) return { open: false, reason: "paused", nextOpen: null };

  const local = new Date(
    now.toLocaleString("en-US", { timeZone: store.timezone }),
  );
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
