import React, { useState } from "react";
import { useUserData, Medication } from "../../hooks/useUserData"; // Adjusted path

const MedicationsScreen: React.FC = () => {
  const { medications = [], addMedication, markMedicationTaken, deleteMedication } = useUserData();
  const [newMed, setNewMed] = useState("");

  const handleAdd = async () => {
    if (!newMed) return;
    await addMedication({ name: newMed });
    setNewMed("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Medications</h1>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={newMed}
          onChange={e => setNewMed(e.target.value)}
          placeholder="Add new medication"
          className="border p-2 rounded flex-1"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul>
        {medications.map((m: Medication) => ( // Explicitly typed here
          <li key={m.id} className="flex justify-between p-2 border-b items-center">
            <span>{m.name}</span>
            <div className="space-x-2">
              {!m.taken && (
                <button
                  onClick={() => markMedicationTaken(m.id!)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Taken
                </button>
              )}
              <button
                onClick={() => deleteMedication(m.id!)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationsScreen;
