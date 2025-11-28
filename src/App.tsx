// frontend/src/App.tsx
import React from "react";
import { AuthProvider, useAuth, AppUser } from "./context/AuthContext";
import { UserDataProvider, useUserData } from "./context/UserDataContext";

// AUTH SCREENS
import SplashScreen from "./screens/auth/SplashScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import RoleSelectScreen from "./screens/auth/RoleSelectScreen";
import ProfileSetupScreen from "./screens/auth/ProfileSetupScreen";

// PATIENT SCREENS
import PatientDashboard from "./screens/patient/PatientDashboard";
import MedicationsScreen from "./screens/patient/MedicationsScreen";
import ReportsScreen from "./screens/patient/ReportsScreen";
import PatientProfileScreen from "./screens/patient/PatientProfileScreen";

// DOCTOR SCREENS
import DoctorDashboard from "./screens/doctor/DoctorDashboard";
import AnalyticsScreen from "./screens/doctor/AnalyticsScreen";
import DoctorProfileScreen from "./screens/doctor/DoctorProfileScreen";

// COMPONENTS
import BottomNav from "./components/nav/BottomNav";
import AddMedicationModal from "./components/modals/AddMedicationModal";
import LogSymptomModal from "./components/modals/LogSymptomModal";

// ---------------------------------------------------------------------
// PATIENT SCREENS RENDERER
// ---------------------------------------------------------------------
const PatientScreens: React.FC<{ currentTab: string }> = ({ currentTab }) => {
  switch (currentTab) {
    case "dashboard":
      return <PatientDashboard />;
    case "medications":
      return <MedicationsScreen />;
    case "reports":
      return <ReportsScreen />;
    case "profile":
      return <PatientProfileScreen />;
    default:
      return <PatientDashboard />;
  }
};

// ---------------------------------------------------------------------
// DOCTOR SCREENS RENDERER
// ---------------------------------------------------------------------
const DoctorScreens: React.FC<{ currentTab: string }> = ({ currentTab }) => {
  switch (currentTab) {
    case "dashboard":
      return <DoctorDashboard />;
    case "analytics":
      return <AnalyticsScreen />;
    case "profile":
      return <DoctorProfileScreen />;
    default:
      return <DoctorDashboard />;
  }
};

// ---------------------------------------------------------------------
// APP ROUTER COMPONENT
// ---------------------------------------------------------------------
const AppRouter: React.FC = () => {
  const { authState, userRole, setUser } = useAuth();
  const { showAddMed, showSymptomLog } = useUserData();
  const [currentTab, setCurrentTab] = React.useState("dashboard");

  // -----------------------------
  // AUTH FLOW SCREENS
  // -----------------------------
  if (authState === "loading") return <SplashScreen />;
  if (authState === "login")
    return <LoginScreen onLoginSuccess={(user: AppUser) => setUser(user)} />;
  if (authState === "signup") return <SignupScreen />;
  if (authState === "roleSelect") return <RoleSelectScreen />;
  if (authState === "profileSetup") return <ProfileSetupScreen />;

  // -----------------------------
  // AUTHENTICATED ROUTES
  // -----------------------------
  if (authState === "authenticated") {
    const isPatient = userRole === "patient";

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Screen */}
        {isPatient ? (
          <PatientScreens currentTab={currentTab} />
        ) : (
          <DoctorScreens currentTab={currentTab} />
        )}

        {/* Bottom Navigation */}
        <BottomNav current={currentTab} setCurrent={setCurrentTab} />

        {/* Modals */}
        {showAddMed && <AddMedicationModal />}
        {showSymptomLog && <LogSymptomModal />}
      </div>
    );
  }

  return <SplashScreen />;
};

// ---------------------------------------------------------------------
// FINAL ROOT APP — WRAPS EVERYTHING IN PROVIDERS
// ---------------------------------------------------------------------
const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserDataProvider>
        <AppRouter />
      </UserDataProvider>
    </AuthProvider>
  );
};

export default App;
