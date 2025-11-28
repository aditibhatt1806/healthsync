import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

import { auth } from "../services/firebase/config";
import { usersService } from "../services/firebase/usersService";

// ---------------- TYPES ----------------
export type AuthStateType =
  | "loading"
  | "login"
  | "signup"
  | "roleSelect"
  | "profileSetup"
  | "authenticated";

export interface AppUser {
  uid: string;
  email?: string;
  role?: string;
  xp?: number;
  streak?: number;
  healthScore?: number;
  [key: string]: any;
}

interface AuthContextShape {
  authState: AuthStateType;
  setAuthState: (s: AuthStateType) => void;
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  userRole: string | null;
  setUserRole: (r: string | null) => void;
}

// ---------------- CONTEXT ----------------
export const AuthContext = createContext<AuthContextShape | null>(null);

// ---------------- PROVIDER ----------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthStateType>("loading");
  const [user, setUser] = useState<AppUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          setUser(null);
          setUserRole(null);
          setAuthState("login");
          return;
        }

        try {
          const profile = await usersService.getUser(firebaseUser.uid);

          // No Firestore profile → force profile setup
          if (!profile) {
            setUser(null);
            setUserRole(null);
            setAuthState("profileSetup");
            return;
          }

          // Avoid duplicate UID by removing Firestore uid field
          const { uid: _ignored, ...cleanProfile } = profile;

          // Single source of truth for UID + clean merge
          const mergedUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? cleanProfile.email,
            ...cleanProfile,
          };

          setUser(mergedUser);
          setUserRole(mergedUser.role || null);
          setAuthState("authenticated");
        } catch (err) {
          console.error("🔥 Firestore fetch error:", err);
          setUser(null);
          setUserRole(null);
          setAuthState("login");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        user,
        setUser,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useAuth = (): AuthContextShape => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
