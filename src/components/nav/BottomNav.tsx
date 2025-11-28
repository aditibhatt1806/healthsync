import React from "react";
import { Home, BarChart2, User, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

type Tab = { key: string; label: string; icon: React.ReactNode };

const BottomNav: React.FC<{ current?: string; setCurrent?: (k: string) => void }> = ({
  current,
  setCurrent,
}) => {
  const { userRole } = useAuth();

  const patientTabs: Tab[] = [
    { key: "dashboard", label: "Home", icon: <Home /> },
    { key: "medications", label: "Meds", icon: <Users /> },
    { key: "reports", label: "Reports", icon: <BarChart2 /> },
    { key: "profile", label: "Profile", icon: <User /> },
  ];

  const doctorTabs: Tab[] = [
    { key: "dashboard", label: "Home", icon: <Home /> },
    { key: "analytics", label: "Analytics", icon: <BarChart2 /> },
    { key: "profile", label: "Profile", icon: <User /> },
  ];

  const tabs = userRole === "doctor" ? doctorTabs : patientTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 flex justify-around z-50">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setCurrent && setCurrent(t.key)}
          className={`flex flex-col items-center transition-colors duration-300 ${
            current === t.key ? "text-blue-600" : "text-gray-500 hover:text-blue-400"
          }`}
        >
          <div className="mb-1">{t.icon}</div>
          <span className="text-sm">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
