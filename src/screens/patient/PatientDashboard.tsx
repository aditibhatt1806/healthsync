import React from "react";
import { Award, Flame, Activity, Pill } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

import ProgressCircle from "../../components/ui/ProgressCircle";
import MedicationCard from "../../components/ui/MedicationCard";
import SymptomSeverityBars from "../../components/ui/SymptomSeverityBars";

const PatientDashboard: React.FC = () => {
  const userData = useUserData();

  // Safe access for all properties
  const user = userData.profile;
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  const healthScore = user?.healthScore ?? 0;
  const medications = userData.medications ?? [];
  const symptoms = userData.symptoms ?? [];
  const markMedicationTaken = userData.markMedicationTaken ?? (() => {});
  const setShowAddMed = userData.setShowAddMed ?? (() => {});
  const setShowSymptomLog = userData.setShowSymptomLog ?? (() => {});

  // Calculate today's progress
  const takenToday = medications.filter((m) => m.taken).length;
  const total = medications.length;
  const progress = total > 0 ? (takenToday / total) * 100 : 0;

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Let’s keep your health on track</p>
        </div>

        {/* XP BADGE */}
        <div className="bg-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2">
          <Award className="text-amber-500" />
          <div>
            <p className="text-xs text-gray-500">XP</p>
            <p className="text-lg font-bold">{xp}</p>
          </div>
        </div>
      </div>

      {/* STREAK CARD */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl">
            <Flame size={40} />
          </div>
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-5xl font-bold">{streak}</p>
            <p className="opacity-90">Days 🔥</p>
          </div>
        </div>
      </div>

      {/* PROGRESS + HEALTH SCORE */}
      <div className="grid grid-cols-2 gap-4">
        {/* MEDICATION PROGRESS CIRCLE */}
        <ProgressCircle progress={progress} taken={takenToday} total={total} />

        {/* HEALTH SCORE */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-lg">
          <div className="flex justify-between">
            <h3 className="font-bold">Health Score</h3>
            <Activity />
          </div>
          <p className="text-5xl font-bold">{healthScore}</p>
          <p className="text-sm">Excellent! 💪</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddMed(true)}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-5 rounded-2xl text-white hover:shadow-xl transition active:scale-95"
        >
          <Pill className="mb-3" size={32} />
          <h4 className="font-bold text-lg">Add Medication</h4>
        </button>

        <button
          onClick={() => setShowSymptomLog(true)}
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-2xl text-white hover:shadow-xl transition active:scale-95"
        >
          <Activity className="mb-3" size={32} />
          <h4 className="font-bold text-lg">Log Symptoms</h4>
        </button>
      </div>

      {/* TODAY'S MEDICATIONS */}
      {medications.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Today's Medications
          </h3>
          <div className="space-y-3">
            {medications.map((med) => (
              med.id && (
                <MedicationCard
                  key={med.id}
                  med={med as any} // workaround for type mismatch
                  onClick={() => !med.taken && markMedicationTaken(med.id!)}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* RECENT SYMPTOMS */}
      {symptoms.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Symptoms</h3>
          {symptoms.slice(0, 3).map((s) =>
            s.id && (
              <div key={s.id} className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">{s.name}</h4>
                    <p className="text-sm text-gray-500">
                      {s.date ? new Date(s.date).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <SymptomSeverityBars severity={s.severity ?? 0} />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
