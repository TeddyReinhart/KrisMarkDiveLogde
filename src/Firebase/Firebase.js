// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; ;
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPqri0UCzENgItQouSBFk235hQdaEsuPM",
  authDomain: "final-project-18590.firebaseapp.com",
  databaseURL: "https://final-project-18590-default-rtdb.firebaseio.com",
  projectId: "final-project-18590",
  storageBucket: "final-project-18590.appspot.com", // Fixed incorrect storage bucket domain
  messagingSenderId: "97806653299",
  appId: "1:97806653299:web:bf23143ddd89eb797ed706",
  measurementId: "G-QRFTE8RRRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app)
// Export Firebase services for use in other parts of the app
export { app, auth, db, database ,storage};
