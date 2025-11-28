import React from "react";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUserData } from "../../hooks/useUserData";
import { authService } from "../../services/firebase/authService";


const PatientProfileScreen: React.FC = () => {
  const { user, setAuthState, setUserRole, setUser } = useAuth();
  const userData = useUserData();
  const xp = userData.profile?.xp ?? 0; // safe access to XP

  const logout = async () => {
    await authService.logout(); // fixed method name
    setUser(null);
    setUserRole(null);
    setAuthState("login");
  };

  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800">Profile</h2>

      {/* PROFILE CARD */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl text-white shadow-lg">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>

          <div>
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="opacity-90">{user?.email}</p>

            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                Level {level}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                {xp} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="space-y-2">
        {/* SETTINGS */}
        <button className="w-full p-4 bg-white rounded-2xl flex justify-between items-center hover:shadow transition">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-gray-600" />
            <span className="font-semibold text-gray-800">Settings</span>
          </div>
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="w-full p-4 bg-red-50 rounded-2xl flex justify-between items-center hover:bg-red-100 transition"
        >
          <div className="flex items-center gap-3">
            <LogOut size={24} className="text-red-600" />
            <span className="font-semibold text-red-600">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PatientProfileScreen;
