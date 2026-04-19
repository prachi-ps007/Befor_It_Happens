
// src/services/firestore.js

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* 📌 COLLECTIONS */
const SIM_COLLECTION = "simulations";
const ALERT_COLLECTION = "alerts";
const ACTION_COLLECTION = "actions";

/* ➕ SAVE SIMULATION */
export const saveSimulation = async (data) => {
  return await addDoc(collection(db, SIM_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

/* 📥 FETCH SIMULATIONS */
export const getSimulations = async () => {
  const snapshot = await getDocs(collection(db, SIM_COLLECTION));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ❌ DELETE */
export const deleteSimulation = async (id) => {
  await deleteDoc(doc(db, SIM_COLLECTION, id));
};

/* 🔔 SAVE ALERT */
export const saveAlert = async (alert) => {
  await addDoc(collection(db, ALERT_COLLECTION), {
    ...alert,
    createdAt: serverTimestamp(),
  });
};

/* 🎮 SAVE USER ACTION */
export const saveAction = async (action) => {
  await addDoc(collection(db, ACTION_COLLECTION), {
    ...action,
    createdAt: serverTimestamp(),
  });
};

