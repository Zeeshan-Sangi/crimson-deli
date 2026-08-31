import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

function getAdminApp(): App | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  if (getApps().length) return getApps()[0];

  try {
    return initializeApp({ credential: cert(JSON.parse(raw)) });
  } catch {
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}
