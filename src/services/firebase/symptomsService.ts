import { db } from "./config";
import { collection, addDoc, doc, deleteDoc, getDocs } from "firebase/firestore";

export interface Symptom {
  id?: string;
  name: string;
  severity?: number;
  date?: string;
}

export const symptomsService = {
  getSymptoms: async (uid: string): Promise<Symptom[]> => {
    const snap = await getDocs(collection(db, "users", uid, "symptoms"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Symptom[];
  },

  logSymptom: async (uid: string, symptom: Omit<Symptom, 'id'>) => {
    await addDoc(collection(db, "users", uid, "symptoms"), {
      ...symptom,
      date: symptom.date || new Date().toISOString(),
    });
  },

  deleteSymptom: async (uid: string, symptomId: string) => {
    await deleteDoc(doc(db, "users", uid, "symptoms", symptomId));
  },
};
