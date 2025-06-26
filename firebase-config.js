import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Firebase configuration
// could be found in project setting in firebase console
const firebaseConfig = {
  apiKey: "AIzaSyCLFCncbdy5ylQdsMujCctEXtUK65CSBjY",
  authDomain: "yadaa-oromia-bot.firebaseapp.com",
  projectId: "yadaa-oromia-bot",
  storageBucket: "yadaa-oromia-bot.firebasestorage.app",
  messagingSenderId: "281838221979",
  appId: "1:281838221979:web:9ad0200b2bdd9d41bbe43e",
  measurementId: "G-976GMP46TB",
};

// Initialize Firebase and export needed SDKs
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
