import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDV1QU-44f7Cu4y-_-A_8ht8Wvhz6rSMHQ',
  authDomain: 'califnco-aqua.firebaseapp.com',
  projectId: 'califnco-aqua',
  storageBucket: 'califnco-aqua.firebasestorage.app',
  messagingSenderId: '413179767005',
  appId: '1:413179767005:web:b5527c834f03f72faa1334',
};
const app = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
