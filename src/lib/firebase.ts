import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export function isFirebaseConfigured() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_APP_ID &&
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  )
}

let app: FirebaseApp | null = null
let analytics: Analytics | null = null
let initPromise: Promise<Analytics | null> | null = null

export async function initFirebaseAnalytics() {
  if (!isFirebaseConfigured()) return null
  if (analytics) return analytics
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (!(await isSupported())) return null
    app = initializeApp(firebaseConfig)
    analytics = getAnalytics(app)
    return analytics
  })()

  return initPromise
}
