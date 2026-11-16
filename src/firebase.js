import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const normalizeConfigValue = (value) => {
  const withoutTrailingComma =
    typeof value === "string" ? value.trim().replace(/,\s*$/, "") : "";
  const quote = withoutTrailingComma[0];
  const isWrappedInQuotes =
    ["'", '"', "`"].includes(quote) && withoutTrailingComma.endsWith(quote);

  return isWrappedInQuotes
    ? withoutTrailingComma.slice(1, -1).trim()
    : withoutTrailingComma;
};

const firebaseConfig = {
  apiKey: normalizeConfigValue(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: normalizeConfigValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: normalizeConfigValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: normalizeConfigValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: normalizeConfigValue(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: normalizeConfigValue(import.meta.env.VITE_FIREBASE_APP_ID),
};

export const missingFirebaseEnv = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);

export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

const firebaseApp = isFirebaseConfigured
  ? getApps().find((app) => app.name === "cryptofutureschool") ??
    initializeApp(firebaseConfig, "cryptofutureschool")
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
