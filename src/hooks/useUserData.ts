import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, query, where } from "firebase/firestore";
import { db } from "../services/firebase/config";
import { medicationsService } from "../services/firebase/medicationsService";
import { symptomsService } from "../services/firebase/symptomsService";
import { useAuth } from "./useAuth";

// ---------------- TYPES ----------------
export interface Medication {
  id?: string;
  name: string;
  dosage?: string;
  taken?: boolean;
}

export interface Symptom {
  id?: string;
  name: string;
  severity?: number;
  date?: string;
}

export interface Profile {
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  xp?: number;
  streak?: number;
  healthScore?: number;
  age?: number;
  phone?: string;
}

// ---------------- HOOK ----------------
export const useUserData = () => {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [patients, setPatients] = useState<Profile[]>([]);

  const [showAddMed, setShowAddMed] = useState(false);
  const [showSymptomLog, setShowSymptomLog] = useState(false);

  // ---------------- PROFILE ----------------
  useEffect(() => {
    if (!userId) return setProfile(null);
    const unsub = onSnapshot(
      doc(db, "users", userId),
      snap => setProfile(snap.exists() ? ({ uid: userId, ...snap.data() } as Profile) : null),
      () => setError("Failed to load profile")
    );
    return () => unsub();
  }, [userId]);

  // ---------------- MEDICATIONS ----------------
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(
      collection(db, "users", userId, "medications"),
      snap => {
        setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Medication[]);
        setLoading(false);
      },
      () => setError("Failed to load medications")
    );
    return () => unsub();
  }, [userId]);

  // ---------------- SYMPTOMS ----------------
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(
      collection(db, "users", userId, "symptoms"),
      snap => setSymptoms(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Symptom[]),
      () => setError("Failed to load symptoms")
    );
    return () => unsub();
  }, [userId]);

  // ---------------- PATIENTS (DOCTOR) ----------------
  useEffect(() => {
    if (!user || user.role !== "doctor") return;
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    const unsub = onSnapshot(q, snap => setPatients(snap.docs.map(d => ({ uid: d.id, ...d.data() } as Profile))));
    return () => unsub();
  }, [user]);

  // ---------------- ACTIONS ----------------
  const addMedication = async (med: Medication) => { if (!userId) return; await medicationsService.addMedication(userId, med); };
  const markMedicationTaken = async (medId: string) => { if (!userId) return; await medicationsService.markAsTaken(userId, medId); };
  const deleteMedication = async (medId: string) => { if (!userId) return; await medicationsService.deleteMedication(userId, medId); };
  const logSymptom = async (symptom: Omit<Symptom, "id">) => { if (!userId) return; await symptomsService.logSymptom(userId, symptom); };
  const deleteSymptom = async (symptomId: string) => { if (!userId) return; await symptomsService.deleteSymptom(userId, symptomId); };

  return {
    loading,
    error,
    profile,
    medications,
    symptoms,
    patients,
    addMedication,
    markMedicationTaken,
    deleteMedication,
    logSymptom,
    deleteSymptom,
    showAddMed,
    setShowAddMed,
    showSymptomLog,
    setShowSymptomLog,
    xp: profile?.xp ?? 0,
    streak: profile?.streak ?? 0,
    healthScore: profile?.healthScore ?? 0,
    user,
  };
};
