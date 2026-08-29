import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app"
import { getAuth, GithubAuthProvider } from "firebase/auth"

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

// Lazy on purpose: getAuth() throws immediately if the API key is missing/invalid,
// which would crash the /auth page for every visitor if run at module load time.
// Only call this from inside the click handler, once the user opts into GitHub sign-in.
export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export function createGithubProvider() {
  const provider = new GithubAuthProvider()
  provider.addScope("repo")
  provider.addScope("read:user")
  provider.addScope("user:email")
  return provider
}

export { GithubAuthProvider }
