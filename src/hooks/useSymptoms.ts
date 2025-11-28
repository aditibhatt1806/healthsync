import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { db } from "../services/firebase/config";
import { symptomsService } from "../services/firebase/symptomsService";
import { collection, query, onSnapshot } from "firebase/firestore";

// Define types for symptoms
interface Symptom {
  id: string;
  name: string; // Assuming symptom has a name property
  severity?: number; // Optional severity property
  date?: string; // Optional date property
}

/**
 * useSymptoms Hook
 * -----------------------------------------------------------
 * Provides:
 * - symptoms (live Firestore data)
 * - loading, error
 * - logSymptom() action
 * - deleteSymptom() if needed
 * - modal state (optional)
 */

export const useSymptoms = () => {
  const { user } = useAuth();
  const userId = user?.uid || null;

  // --------------------------
  // UI State
  // --------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showSymptomLog, setShowSymptomLog] = useState<boolean>(false);

  // --------------------------
  // Data State
  // --------------------------
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  // --------------------------
  // Live Symptoms Listener
  // --------------------------
  useEffect(() => {
    if (!userId) {
      setSymptoms([]);
      return;
    }

    const qSym = query(collection(db, "users", userId, "symptoms"));

    const unsubscribe = onSnapshot(
      qSym,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Symptom[]; // Ensure proper typing

        setSymptoms(list);
        setLoading(false);
      },
      (err) => {
        console.error("Symptoms listener error:", err);
        setError("Failed to load symptoms.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // --------------------------
  // ACTIONS
  // --------------------------

  const logSymptom = async (data: Omit<Symptom, 'id'>) => {
    try {
      if (!userId) return;

      await symptomsService.logSymptom(userId, data);
      setShowSymptomLog(false);
    } catch (err) {
      console.error("Log symptom failed:", err);
      setError("Failed to log symptom.");
    }
  };

  const deleteSymptom = async (id: string) => {
    try {
      if (!userId) return;
      await symptomsService.deleteSymptom(userId, id);
    } catch (err) {
      console.error("Delete symptom failed:", err);
      setError("Failed to delete symptom.");
    }
  };

  // --------------------------
  // EXPORT API
  // --------------------------
  return {
    loading,
    error,
    symptoms,
    logSymptom,
    deleteSymptom,
    showSymptomLog,
    setShowSymptomLog,
  };
};
