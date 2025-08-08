// src/utils/firebase.ts
// Firebase initialization utility for Realtime Database integration
// Reads config from environment variables (see .env.example)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, enableLogging } from 'firebase/database';
import { getAnalytics, logEvent, isSupported as analyticsIsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Only initialize if not already initialized (Next.js hot reload safe)
export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

// Enable verbose Realtime Database logging in development
if (process.env.NODE_ENV === 'development') {
  enableLogging(true);
}

export function getFirebaseDatabase() {
  return getDatabase(getFirebaseApp());
}

// Analytics helpers
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
export async function getFirebaseAnalytics() {
  if (!analyticsInstance && typeof window !== 'undefined') {
    if (await analyticsIsSupported()) {
      analyticsInstance = getAnalytics(getFirebaseApp());
    }
  }
  return analyticsInstance;
}

// Log a debug event to Analytics (for workflow tracing, not low-level logs)
export async function logDebugEvent(eventName: string, params?: Record<string, unknown>) {
  const analytics = await getFirebaseAnalytics();
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}
