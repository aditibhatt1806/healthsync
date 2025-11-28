import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebase/config";
import { usersService } from "../services/firebase/usersService";

type AuthStateType =
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

export const AuthContext = createContext<AuthContextShape | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthStateType>("loading");
  const [user, setUser] = useState<AppUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const profile = await usersService.getUser(firebaseUser.uid);

            if (!profile) {
              setUser(null);
              setUserRole(null);
              setAuthState("login");
              return;
            }

            const { uid: _ignore, ...restProfile } = profile;

            const mergedUser: AppUser = {
              uid: firebaseUser.uid,
              ...restProfile,
            };

            setUser(mergedUser);
            setUserRole(mergedUser.role || null);
            setAuthState("authenticated");
          } catch (err) {
            console.error("Failed loading user profile:", err);
            setUser(null);
            setUserRole(null);
            setAuthState("login");
          }
        } else {
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

export default AppProvider;
