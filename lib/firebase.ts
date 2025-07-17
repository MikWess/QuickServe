// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8fX6d7WOZ6GQb2G1qwj4jwtTUf70-1X4",
  authDomain: "wessmanservice.firebaseapp.com",
  projectId: "wessmanservice",
  storageBucket: "wessmanservice.firebasestorage.app",
  messagingSenderId: "249387872089",
  appId: "1:249387872089:web:318128a28e7387037fa648",
  measurementId: "G-Y4HVDJS2NS"
};

let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services with error handling
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize Analytics only in browser environment and with error handling
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
      analytics = null;
    }
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create mock objects to prevent crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject('Firebase not available'),
    createUserWithEmailAndPassword: () => Promise.reject('Firebase not available'),
    signOut: () => Promise.reject('Firebase not available'),
    signInWithPopup: () => Promise.reject('Firebase not available'),
    updateProfile: () => Promise.reject('Firebase not available')
  };
  
  db = {
    collection: () => ({}),
    doc: () => ({}),
    query: () => ({}),
    where: () => ({}),
    orderBy: () => ({}),
    onSnapshot: () => () => {},
    addDoc: () => Promise.reject('Firebase not available'),
    updateDoc: () => Promise.reject('Firebase not available'),
    deleteDoc: () => Promise.reject('Firebase not available'),
    getDocs: () => Promise.reject('Firebase not available'),
    serverTimestamp: () => new Date()
  };
}

export { auth, db, analytics };
export default app; 