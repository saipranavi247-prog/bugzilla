import { cert, getApps, getApp, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function getAdminApp() {
  if (getApps().length) return getApp()
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

export async function verifyFirebaseIdToken(idToken: string) {
  return getAuth(getAdminApp()).verifyIdToken(idToken)
}
