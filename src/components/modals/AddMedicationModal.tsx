import React, { useState } from "react";
import { X } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";
import axios from "axios";

interface AddMedicationResponse {
  ok: boolean;
  message?: string;
  [key: string]: any; // allow extra fields
}

const AddMedicationModal: React.FC = () => {
  const { setShowAddMed } = useUserData();

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    time: "",
    color: "#6B5B95",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.dosage || !form.time) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("healthsync_user_token");

      const response = await axios.post<AddMedicationResponse>(
        "https://us-central1-your-project-id.cloudfunctions.net/api/medications",
        {
          ...form,
          userId: localStorage.getItem("healthsync_user_id"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.ok) {
        setShowAddMed(false); // close modal
      } else {
        setError("Failed to add medication. Try again.");
      }
    } catch (err) {
      console.error("Add medication error:", err);
      setError("Failed to add medication. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="bg-white w-full p-6 rounded-t-3xl animate-slide-up">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Add Medication</h2>
          <button onClick={() => setShowAddMed(false)} aria-label="Close">
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
            placeholder="Medication Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            placeholder="Dosage (e.g. 50mg)"
            className="input"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          />

          <input
            required
            type="time"
            className="input"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <label className="text-gray-700 font-medium">Color</label>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full h-10 rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Medication"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationModal;
