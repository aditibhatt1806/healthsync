import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATr_fYsF2Mg0xmGRy8Kcef5pzlDYHt9Vc",
  authDomain: "healthsync-98ac6.firebaseapp.com",
  projectId: "healthsync-98ac6",
  storageBucket: "healthsync-98ac6.firebasestorage.app",
  messagingSenderId: "468052940522",
  appId: "1:468052940522:web:07cacc67d5006d342b6993",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
