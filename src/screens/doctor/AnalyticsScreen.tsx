import React, { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Pill,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";

import { symptomsService } from "../../services/firebase/symptomsService";
import { medicationsService } from "../../services/firebase/medicationsService";
import { usersService } from "../../services/firebase/usersService";
import { useAuth } from "../../hooks/useAuth";

const AnalyticsScreen: React.FC = () => {
  const { user } = useAuth();

  // prevent null user crash
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading user...
      </div>
    );
  }

  // Doctor analytics
  const [patientsCount, setPatientsCount] = useState(0);

  // Patient analytics
  const [symptomsLogged, setSymptomsLogged] = useState(0);
  const [medicationsTotal, setMedicationsTotal] = useState(0);
  const [medicationsTaken, setMedicationsTaken] = useState(0);
  const [adherence, setAdherence] = useState(0);
  const [severityTrend, setSeverityTrend] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Doctor → fetch patients list
      if (user.role === "doctor") {
        const allPatients = await usersService.listUsersByRole("patient");
        setPatientsCount(allPatients.length);
      }

      // Patient → their own stats
      if (user.role === "patient") {
        const meds = await medicationsService.getMedications(user.uid);
        const syms = await symptomsService.getSymptoms(user.uid);

        // medications
        const takenCount = meds.filter((m) => m.taken === true).length;
        const totalCount = meds.length;

        setMedicationsTotal(totalCount);
        setMedicationsTaken(takenCount);

        const adherencePercent =
          totalCount === 0 ? 0 : Math.round((takenCount / totalCount) * 100);

        setAdherence(adherencePercent);

        // symptoms
        setSymptomsLogged(syms.length);

        // severity trend - ensure ONLY numbers
        const severities = syms
          .map((s) => Number(s.severity ?? 0))
          .slice(-5)
          .reverse();

        setSeverityTrend(severities);
      }
    } catch (err) {
      console.error("Analytics load failed:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>

      {loading ? (
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center text-gray-500">
          Loading analytics...
        </div>
      ) : (
        <>
          {/* DOCTOR ANALYTICS */}
          {user.role === "doctor" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                <Users size={32} className="text-blue-600 mb-2" />
                <p className="text-4xl font-bold text-gray-800">{patientsCount}</p>
                <p className="text-gray-600 text-sm">Total Patients</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                <Activity size={32} className="text-purple-600 mb-2" />
                <p className="text-4xl font-bold text-gray-800">Live</p>
                <p className="text-gray-600 text-sm">Health Tracking</p>
              </div>
            </div>
          )}

          {/* PATIENT ANALYTICS */}
          {user.role === "patient" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                  <Pill size={32} className="text-blue-600 mb-2" />
                  <p className="text-4xl font-bold text-gray-800">{medicationsTotal}</p>
                  <p className="text-gray-600 text-sm">Medications</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-green-600 mb-2" />
                  <p className="text-4xl font-bold text-gray-800">{medicationsTaken}</p>
                  <p className="text-gray-600 text-sm">Taken</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                  <BarChart3 size={32} className="text-amber-600 mb-2" />
                  <p className="text-4xl font-bold text-gray-800">{adherence}%</p>
                  <p className="text-gray-600 text-sm">Adherence</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
                  <HeartPulse size={32} className="text-red-600 mb-2" />
                  <p className="text-4xl font-bold text-gray-800">{symptomsLogged}</p>
                  <p className="text-gray-600 text-sm">Symptoms Logged</p>
                </div>
              </div>

              {/* Severity Trend */}
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Recent Symptom Severity
                </h3>

                {severityTrend.length === 0 ? (
                  <p className="text-gray-500 text-sm">No symptom logs yet.</p>
                ) : (
                  <div className="flex gap-2">
                    {severityTrend.map((level, i) => (
                      <div key={i} className="w-8 flex flex-col items-center">
                        <div
                          className={`w-6 rounded-xl ${
                            level === 1
                              ? "h-4 bg-green-400"
                              : level === 2
                              ? "h-5 bg-yellow-400"
                              : level === 3
                              ? "h-7 bg-orange-500"
                              : level === 4
                              ? "h-9 bg-red-400"
                              : "h-11 bg-red-600"
                          }`}
                        ></div>
                        <p className="text-xs mt-1 text-gray-500">{level}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsScreen;
