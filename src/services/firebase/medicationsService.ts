import { db } from "./config";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

export interface Medication {
  id?: string;
  name: string;
  dosage?: string;
  taken?: boolean;
  time?: string;
  color?: string;
  createdAt?: number;
}

export const medicationsService = {
  getMedications: async (uid: string): Promise<Medication[]> => {
    const snap = await getDocs(collection(db, "users", uid, "medications"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Medication[];
  },

  addMedication: async (uid: string, med: Medication) => {
    const docRef = await addDoc(collection(db, "users", uid, "medications"), {
      ...med,
      taken: false,
      createdAt: Date.now(),
    });
    return { id: docRef.id, ...med };
  },

  markAsTaken: async (uid: string, medId: string) => {
    await updateDoc(doc(db, "users", uid, "medications", medId), {
      taken: true,
      lastTaken: Date.now(),
    });
  },

  updateMedication: async (uid: string, medId: string, updates: Partial<Medication>) => {
    await updateDoc(doc(db, "users", uid, "medications", medId), {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  deleteMedication: async (uid: string, medId: string) => {
    await deleteDoc(doc(db, "users", uid, "medications", medId));
  },
};
