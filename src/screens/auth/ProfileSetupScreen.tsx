import React from "react";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth"; // fixed path
import { useUserData, Medication, Symptom } from "../../hooks/useUserData"; // fixed path
import { authService } from "../../services/firebase/authService";
 // fixed path

const ProfileSetupScreen: React.FC = () => {
  const { user } = useAuth();
  const { profile, medications = [], symptoms = [] } = useUserData();

  const handleLogout = async () => {
    await authService.logout();
    // reset auth state if needed
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{profile?.name || "Patient"}</h1>
        <div className="flex space-x-2">
          <Settings className="cursor-pointer" />
          <LogOut className="cursor-pointer" onClick={handleLogout} />
        </div>
      </div>

      <div className="mb-4">
        <p>Email: {profile?.email}</p>
        <p>XP: {profile?.xp ?? 0}</p>
        <p>Health Score: {profile?.healthScore ?? 0}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Medications</h2>
        <ul>
          {medications.map((m: Medication) => (
            <li key={m.id} className="p-2 border-b">
              {m.name} {m.dosage ? `- ${m.dosage}` : ""}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold">Symptoms</h2>
        <ul>
          {symptoms.map((s: Symptom) => (
            <li key={s.id} className="p-2 border-b">
              {s.name} {s.severity ? `(${s.severity})` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
