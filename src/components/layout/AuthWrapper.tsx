import React, { useEffect } from "react";
import axios from "axios";

// Context hooks
import { useAuth } from "../../hooks/useAuth";
import { useUserData } from "../../hooks/useUserData";

// Auth Screens
import SplashScreen from "../../screens/auth/SplashScreen";
import LoginScreen from "../../screens/auth/LoginScreen";
import SignupScreen from "../../screens/auth/SignupScreen";
import RoleSelectScreen from "../../screens/auth/RoleSelectScreen";
import ProfileSetupScreen from "../../screens/auth/ProfileSetupScreen";

// Patient Screens
import PatientDashboard from "../../screens/patient/PatientDashboard";
import MedicationsScreen from "../../screens/patient/MedicationsScreen";
import PatientProfileScreen from "../../screens/patient/PatientProfileScreen";

// Doctor Screens
import DoctorDashboard from "../../screens/doctor/DoctorDashboard";
import DoctorProfileScreen from "../../screens/doctor/DoctorProfileScreen";

// UI Components
import BottomNav from "../nav/BottomNav";
import AddMedicationModal from "../modals/AddMedicationModal";
import LogSymptomModal from "../modals/LogSymptomModal";

// Types
import { AppUser } from "../../context/AuthContext";

interface UserResponse {
  user: AppUser;
}

const AuthWrapper: React.FC = () => {
  const { authState, userRole, user, setUser } = useAuth();
  const { showAddMed, showSymptomLog } = useUserData();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (authState !== "authenticated" || !user?.uid) return;

      try {
        const token = localStorage.getItem("healthsync_user_token");
        if (!token) return;

        const res = await axios.get<UserResponse>(
          `https://us-central1-your-project-id.cloudfunctions.net/api/users/${user.uid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserDetails();
  }, [authState, user?.uid, setUser]);

  if (authState === "loading") return <SplashScreen />;

  if (authState === "login")
    return <LoginScreen onLoginSuccess={(u) => setUser(u)} />;

  if (authState === "signup") return <SignupScreen />;

  if (authState === "roleSelect") return <RoleSelectScreen />;

  if (authState === "profileSetup") return <ProfileSetupScreen />;

  if (authState === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
        <div className="max-w-2xl mx-auto">
          {userRole === "patient" && (
            <>
              <PatientDashboard />
              <MedicationsScreen />
              <PatientProfileScreen />
            </>
          )}

          {userRole === "doctor" && (
            <>
              <DoctorDashboard />
              <DoctorProfileScreen />
            </>
          )}
        </div>

        <BottomNav />

        {showAddMed && <AddMedicationModal />}
        {showSymptomLog && <LogSymptomModal />}
      </div>
    );
  }

  return <SplashScreen />;
};

export default AuthWrapper;
