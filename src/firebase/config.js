// Firebase configuration — replace with your actual Firebase project credentials
// Get these from Firebase Console > Project Settings > Your Apps
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5B6t61w5W4Qohqpt_Ex0gU8Iq6ZTuQN0",
  authDomain: "krisha-beauty-parlour.firebaseapp.com",
  projectId: "krisha-beauty-parlour",
  storageBucket: "krisha-beauty-parlour.firebasestorage.app",
  messagingSenderId: "495498989747",
  appId: "1:495498989747:web:092b85cc5b937b267960c6",
  measurementId: "G-FYWS41VHG0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
