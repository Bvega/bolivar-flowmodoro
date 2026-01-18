// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This is your unique "bridge" configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDiXyQ2GV-u0qe47Hw6SrWCMjxtZ7DB1eg",
  authDomain: "bolivar-flowmorodo.firebaseapp.com",
  projectId: "bolivar-flowmorodo",
  storageBucket: "bolivar-flowmorodo.firebasestorage.app",
  messagingSenderId: "1069958358441",
  appId: "1:1069958358441:web:5d8587970e433e4b5cd0b8",
  measurementId: "G-4WX4LC0WBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export the tools so other files can use them
export const auth = getAuth(app); // For your zero-friction login 
export const db = getFirestore(app); // For real-time data sync [cite: 98, 103]