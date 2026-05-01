import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZvOmFftkt7NIdFLRcbIlsIVE2qSnNkEA",
  authDomain: "finora-3912b.firebaseapp.com",
  projectId: "finora-3912b",
  storageBucket: "finora-3912b.firebasestorage.app",
  messagingSenderId: "154655644703",
  appId: "1:154655644703:web:9d911679bec9e38aa1c92a",
  measurementId: "G-QFVZJ5FGQY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
