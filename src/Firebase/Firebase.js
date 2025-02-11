import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPqri0UCzENgItQouSBFk235hQdaEsuPM",
  authDomain: "final-project-18590.firebaseapp.com",
  projectId: "final-project-18590",
  storageBucket: "final-project-18590.appspot.com",
  messagingSenderId: "97806653299",
  appId: "1:97806653299:web:bf23143ddd89eb797ed706",
  measurementId: "G-QRFTE8RRRV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
