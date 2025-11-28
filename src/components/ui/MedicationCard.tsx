import React from "react";
import { CheckCircle } from "lucide-react";
import axios from "axios";

type Med = {
  id: string;
  name: string;
  dosage?: string;
  time?: string;
  color?: string;
  taken?: boolean;
};

const MedicationCard: React.FC<{ med: Med; onClick?: () => void }> = ({ med, onClick }) => {
  
  const handleMarkTaken = async () => {
    if (!med.taken) { // Only proceed if the medication is not already marked as taken
      try {
        const token = localStorage.getItem("healthsync_user_token"); // Retrieve the token from localStorage
        await axios.put(`https://us-central1-your-project-id.cloudfunctions.net/api/medications/${med.id}`, {
          taken: true,
          lastTaken: new Date().toISOString(), // Log the time when the medication was taken
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Optionally, you can trigger a callback or refresh the state to reflect the change
        if (onClick) {
          onClick(); // Call the onClick function if provided, to update the parent state
        }
      } catch (error) {
        console.error("Failed to mark medication as taken:", error);
      }
    }
  };

  return (
    <button
      onClick={handleMarkTaken} // Call the function to mark as taken
      className={`w-full p-4 rounded-2xl flex items-center justify-between shadow-lg ${med.taken ? "bg-green-50" : "bg-white"}`}
    >
      <div className="flex gap-4 items-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
          style={{ backgroundColor: med.color || "#6B5B95" }}
        >
          {med.name?.charAt(0) || "M"}
        </div>

        <div>
          <h3 className="font-bold text-lg">{med.name}</h3>
          <p className="text-gray-600">{med.dosage} • {med.time}</p>
        </div>
      </div>

      {med.taken && <CheckCircle size={28} className="text-green-500" />}
    </button>
  );
};

export default MedicationCard;
