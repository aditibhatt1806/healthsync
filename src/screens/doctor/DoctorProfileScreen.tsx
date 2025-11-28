import React from "react";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from '../../services/firebase/authService';


const DoctorProfileScreen: React.FC = () => {
  const { user, setAuthState, setUser, setUserRole } = useAuth();

  const logout = async () => {
    await authService.logout(); // <- fixed
    setUser(null);
    setUserRole(null);
    setAuthState("login");
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile</h2>

      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            👨‍⚕️
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="opacity-90">{user?.email}</p>
            <p className="opacity-90 mt-1 text-sm">Doctor Account</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full p-4 bg-white rounded-2xl flex justify-between items-center hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-gray-600" />
            <span className="font-semibold">Settings</span>
          </div>
        </button>

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

export default DoctorProfileScreen;
