import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface ExtraUserData {
  name?: string;
  [key: string]: any;
}

export const authService = {
  register: async (email: string, password: string, extra: ExtraUserData) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    if (extra.name) {
      await updateProfile(user, { displayName: extra.name });
    }

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      ...extra,
      xp: 0,
      streak: 0,
      healthScore: 100,
      createdAt: Date.now(),
      role: extra.role || "patient",
    });

    return user;
  },

  login: async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) throw new Error("Profile not found");

    return snap.data();
  },

  logout: async () => {
    await signOut(auth);
  },
};
