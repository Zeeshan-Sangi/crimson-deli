import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

function getAdminApp(): App | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  const existing = getApps();
  if (existing.length) return existing[0];

  try {
    const app = initializeApp({ credential: cert(JSON.parse(raw)) });
    // settings() may only be called once per Firestore instance, and only
    // before any other call — so it belongs here, on first initialisation,
    // not in getAdminDb() which runs on every query.
    getFirestore(app).settings({ ignoreUndefinedProperties: true });
    return app;
  } catch {
    return null;
  }
}

export async function getAdminAuth(): Promise<Auth | null> {
  const app = getAdminApp();
  if (!app) return null;
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(app);
}

export function getAdminDb(): Firestore {
  const app = getAdminApp();
  if (!app) {
    throw new Error(
      "Firestore is not configured — set FIREBASE_SERVICE_ACCOUNT_JSON.",
    );
  }
  return getFirestore(app);
}
