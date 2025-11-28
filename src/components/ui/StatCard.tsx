import React, { useEffect, useState } from "react";
import axios from "axios";

// Define response type
interface StatResponse {
  ok: boolean;
  value: string | number;
}

const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  userId: string; 
  color?: string 
}> = ({ icon, label, userId, color }) => {
  const [value, setValue] = useState<string | number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const token = localStorage.getItem("healthsync_user_token");
        const response = await axios.get<StatResponse>(
          `https://us-central1-your-project-id.cloudfunctions.net/api/stats/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.ok) {
          setValue(response.data.value);
        } else {
          setError("Failed to fetch statistics.");
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStat();
  }, [userId]);

  return (
    <div
      className="rounded-3xl p-6 text-white shadow-lg"
      style={{ background: color || "linear-gradient(90deg,#667eea,#764ba2)" }}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-sm opacity-90">{label}</p>
      {loading ? (
        <p className="text-4xl font-bold">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-4xl font-bold">{value}</p>
      )}
    </div>
  );
};

export default StatCard;
