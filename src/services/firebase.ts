import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQPJBLhIOiV9uiDnOoi9wHvIflN9I2tws",
  authDomain: "rdc-plaques-system.firebaseapp.com",
  projectId: "rdc-plaques-system",
  storageBucket: "rdc-plaques-system.firebasestorage.app",
  messagingSenderId: "1060759632726",
  appId: "1:1060759632726:web:bdcc3c9425317ab16e74f7",
  measurementId: "G-PGR5FXE0WV"
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