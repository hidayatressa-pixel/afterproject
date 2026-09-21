import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const fallbackConfig = {
  apiKey: 'AIzaSyDt20Elr4JD6N6S7uaPMy18D7NXmktEuOE',
  authDomain: 'afterweb-ba6f4.firebaseapp.com',
  projectId: 'afterweb-ba6f4',
  storageBucket: 'afterweb-ba6f4.firebasestorage.app',
  messagingSenderId: '435692780334',
  appId: '1:435692780334:web:e5249b640216d6bd3c98bf',
};

const firebaseConfig = Object.values(envConfig).every(Boolean) ? envConfig : fallbackConfig;

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = (() => {
  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    return getFirestore(firebaseApp);
  }
})();
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const isFirebaseConfigured = true;
