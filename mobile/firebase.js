import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase web config is client-side configuration, not an admin credential.
const firebaseConfig = {
  apiKey: 'AIzaSyDV1QU-44f7Cu4y-_-A_8ht8Wvhz6rSMHQ',
  authDomain: 'califnco-aqua.firebaseapp.com',
  projectId: 'califnco-aqua',
  storageBucket: 'califnco-aqua.firebasestorage.app',
  messagingSenderId: '413179767005',
  appId: '1:413179767005:web:b5527c834f03f72faa1334',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  // Metro Fast Refresh can evaluate this module more than once.
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
