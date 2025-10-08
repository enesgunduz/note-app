import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';


// Firebase configuration - replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyB7cQRq7GlIKu2MxBHymEtnRPV-YzH8NTQ",
  authDomain: "note-app-cebed.firebaseapp.com",
  projectId: "note-app-cebed",
  storageBucket: "note-app-cebed.firebasestorage.app",
  messagingSenderId: "474512891658",
  appId: "1:474512891658:web:2bc7182debd239ef2224f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export { auth };
export default app;