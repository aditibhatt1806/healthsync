import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export const usersService = {
  
  // Fetch ANY user
  getUser: async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  },

  // Fetch user profile
  getUserProfile: async (uid: string) => {
    const snap = await getDoc(doc(db, "profiles", uid));
    return snap.exists() ? snap.data() : null;
  },

  // Update user
  updateUserProfile: async (uid: string, updates: any) => {
    await updateDoc(doc(db, "users", uid), updates);
  },

  // Doctor: list patients or patient: list doctors
  listUsersByRole: async (role: "doctor" | "patient") => {
    const q = query(collection(db, "users"), where("role", "==", role));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  },

  // Get all patients for dashboard
  listPatients: async () => {
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  },
};
