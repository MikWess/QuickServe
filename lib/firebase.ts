// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8fX6d7WOZ6GQb2G1qwj4jwtTUf70-1X4",
  authDomain: "wessmanservice.firebaseapp.com",
  projectId: "wessmanservice",
  storageBucket: "wessmanservice.firebasestorage.app",
  messagingSenderId: "249387872089",
  appId: "1:249387872089:web:318128a28e7387037fa648",
  measurementId: "G-Y4HVDJS2NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' && typeof getAnalytics !== 'undefined' ? getAnalytics(app) : null;

export default app; 