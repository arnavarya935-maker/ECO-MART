const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.authDomain
);

let app = null;
let auth = null;
let googleProvider = null;

export { auth, googleProvider };

export async function loginWithFirebaseGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('Google Sign-In is not configured yet. Please continue as Guest or sign in with email.');
  }
  if (!app) {
    try {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth, GoogleAuthProvider } = await import('firebase/auth');
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
    } catch (err) {
      console.warn('Google Sign-In initialization failed:', err.message);
      throw new Error('Could not connect to Google Sign-In right now. Please continue as Guest or sign in with email.');
    }
  }
  const { signInWithPopup } = await import('firebase/auth');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}
