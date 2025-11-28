import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Use the fixed hook
import { medicationsService } from "../services/firebase/medicationsService";
import { symptomsService } from "../services/firebase/symptomsService";
import { usersService } from "../services/firebase/usersService";
import { db } from "../services/firebase/config";
import { collection, query, onSnapshot, doc } from "firebase/firestore";


// ---------------- TYPES ----------------
export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  time?: string;
  taken?: boolean;
}

export interface Symptom {
  id: string;
  name: string;
  severity?: number;
  date?: string;
}

export interface Profile {
  xp?: number;
  streak?: number;
  healthScore?: number;
}

interface UserDataContextShape {
  medications: Medication[];
  symptoms: Symptom[];
  patients: any[];
  profile: Profile | null;

  showAddMed: boolean;
  setShowAddMed: (show: boolean) => void;
  showSymptomLog: boolean;
  setShowSymptomLog: (show: boolean) => void;

  addMedication: (data: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  markMedicationTaken: (id: string) => Promise<void>;
  logSymptom: (data: Symptom) => Promise<void>;
}

// ---------------- CONTEXT ----------------
export const UserDataContext = createContext<UserDataContextShape | null>(null);

// ---------------- PROVIDER ----------------
export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userRole } = useAuth();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAddMed, setShowAddMed] = useState<boolean>(false);
  const [showSymptomLog, setShowSymptomLog] = useState<boolean>(false);

  const userId = user?.uid;

  // Load profile
  useEffect(() => {
    if (!userId) return setProfile(null);

    const unsub = onSnapshot(
      doc(db, "users", userId),
      (snap) => setProfile(snap.exists() ? (snap.data() as Profile) : null),
      (err) => console.error("Profile listener error:", err)
    );

    return () => unsub();
  }, [userId]);

  // Medications listener
  useEffect(() => {
    if (!userId) return setMedications([]);

    const qMed = query(collection(db, "users", userId, "medications"));
    const unsub = onSnapshot(
      qMed,
      (snap) => setMedications(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Medication[]),
      (err) => console.error("Medications listener error:", err)
    );

    return () => unsub();
  }, [userId]);

  // Symptoms listener
  useEffect(() => {
    if (!userId) return setSymptoms([]);

    const qSym = query(collection(db, "users", userId, "symptoms"));
    const unsub = onSnapshot(
      qSym,
      (snap) => setSymptoms(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Symptom[]),
      (err) => console.error("Symptoms listener error:", err)
    );

    return () => unsub();
  }, [userId]);

  // Doctor: load patients
  useEffect(() => {
    if (userRole !== "doctor") return setPatients([]);

    let mounted = true;
    usersService
      .listPatients()
      .then((list: any[]) => mounted && setPatients(list))
      .catch((err) => console.error("Failed to load patients:", err));

    return () => { mounted = false; };
  }, [userRole]);

  // Actions
  const addMedication = async (data: Medication) => {
    if (!userId) return;
    await medicationsService.addMedication(userId, data);
    setShowAddMed(false);
  };

  const deleteMedication = async (id: string) => {
    if (!userId) return;
    await medicationsService.deleteMedication(userId, id);
  };

  const markMedicationTaken = async (id: string) => {
    if (!userId) return;
    await medicationsService.markAsTaken(userId, id);
  };

  const logSymptom = async (data: Symptom) => {
    if (!userId) return;
    await symptomsService.logSymptom(userId, data);
    setShowSymptomLog(false);
  };

  return (
    <UserDataContext.Provider
      value={{
        medications,
        symptoms,
        patients,
        profile,
        showAddMed,
        setShowAddMed,
        showSymptomLog,
        setShowSymptomLog,
        addMedication,
        deleteMedication,
        markMedicationTaken,
        logSymptom,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useUserData = (): UserDataContextShape => {
  const context = React.useContext(UserDataContext);
  if (!context) throw new Error("useUserData must be used within a UserDataProvider");
  return context;
};
