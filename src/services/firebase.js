import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_o72wuTZYIGXZ2hbRqLsPXrI0H6pCznc",
  authDomain: "before-it-happens.firebaseapp.com",
  projectId: "before-it-happens",
  storageBucket: "before-it-happens.firebasestorage.app",
  messagingSenderId: "1097120662152",
  appId: "1:1097120662152:web:4f7f3d8cd794be0492953d",
  measurementId: "G-2DV5VN8J08"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);