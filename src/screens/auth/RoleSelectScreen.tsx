import React from "react";
import { Heart, Activity } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const RoleSelectScreen: React.FC = () => {
  const { setAuthState, setUserRole } = useAuth();

  const choose = (role: "patient" | "doctor") => {
    setUserRole(role);
    setAuthState("profileSetup"); // next screen will save Firestore profile
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="w-full max-w-2xl text-center">

        <h2 className="text-4xl font-bold mb-10 text-gray-800">
          Choose Your Role
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* PATIENT BUTTON */}
          <button
            onClick={() => choose("patient")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Heart className="text-white" size={40} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">Patient</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Track medications, symptoms, and health progress
            </p>
          </button>

          {/* DOCTOR BUTTON */}
          <button
            onClick={() => choose("doctor")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Activity className="text-white" size={40} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800">Doctor</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Monitor patients and analyze health trends
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default RoleSelectScreen;
