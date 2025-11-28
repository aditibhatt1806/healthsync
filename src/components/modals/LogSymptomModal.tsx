import React, { useState } from "react";
import { X } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";
import axios from "axios";

interface SymptomResponse {
  ok: boolean;
  [key: string]: any;
}

const LogSymptomModal: React.FC = () => {
  const { setShowSymptomLog } = useUserData();

  const [form, setForm] = useState({
    name: "",
    severity: 5,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name) {
      setError("Please enter a symptom name.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("healthsync_user_token");
      const userId = localStorage.getItem("healthsync_user_id");

      const response = await axios.post<SymptomResponse>(
        "https://us-central1-your-project-id.cloudfunctions.net/api/symptoms",
        {
          ...form,
          userId,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.ok) {
        setShowSymptomLog(false);
      } else {
        setError("Failed to log symptom. Try again.");
      }
    } catch (err) {
      console.error("Log symptom error:", err);
      setError("Failed to log symptom. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="bg-white w-full p-6 rounded-t-3xl animate-slide-up">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Log Symptom</h2>
          <button onClick={() => setShowSymptomLog(false)} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            placeholder="Symptom Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="font-medium">Severity: {form.severity}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={form.severity}
            onChange={(e) =>
              setForm({ ...form, severity: Number(e.target.value) })
            }
            className="w-full"
          />

          <textarea
            placeholder="Notes (optional)"
            className="input h-24"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging..." : "Log Symptom"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogSymptomModal;
