import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXrkCOwGWIQwXSAVWEFqlqH8lZXXovKuU",
  authDomain: "plaques-rdc-9d2e1.firebaseapp.com",
  projectId: "plaques-rdc-9d2e1",
  storageBucket: "plaques-rdc-9d2e1.firebasestorage.app",
  messagingSenderId: "15966303389",
  appId: "1:15966303389:web:ec58fc37517331839c1074",
  measurementId: "G-SRT1YPME3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, analytics, auth, db, storage }; 