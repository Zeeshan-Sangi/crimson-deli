import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseClientConfigured()) return null;
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function getClientAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}
