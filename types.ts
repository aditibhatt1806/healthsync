// ========================================================
//                    USER TYPES
// ========================================================

// Main authenticated user type (used in useAuth, Firestore user doc)
export type AppUser = {
  uid: string;
  email?: string;          // Firebase may return null
  name?: string;
  role: string;            // "doctor" | "patient" | etc.
  xp: number;
  streak: number;
  healthScore: number;
};

// User profile stored inside /profiles/{uid}
export interface Profile {
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  xp?: number;
  streak?: number;
  healthScore?: number;
  
  // Additional info
  age?: number;
  phone?: string;
}



// ========================================================
//                    MEDICATION TYPES
// ========================================================

export interface Medication {
  id?: string;             // Firestore document ID
  name: string;
  dosage?: string;
  taken?: boolean;         // Whether taken today
}



// ========================================================
//                    SYMPTOM TYPES
// ========================================================

export interface Symptom {
  id?: string;              // Firestore document ID
  name: string;
  severity?: number;        // 1–5 scale OR 0–10 if you choose
  date?: string | number;   // Timestamp or Firestore date
}



// ========================================================
//                 PROGRESS / STATS TYPES
// ========================================================

export interface ProgressData {
  ok: boolean;
  taken: number;
  total: number;
}



// ========================================================
//        STRUCTURES FOR ADDING / LOGGING NEW DATA
// ========================================================

// Add new medication
export interface LogMedication {
  name: string;
  dosage?: string;
}

// Add new symptom
export interface LogSymptom {
  name: string;
  severity?: number;
  date?: string | number;
}
