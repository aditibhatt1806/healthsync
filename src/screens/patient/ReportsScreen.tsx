import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for a report
interface Report {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
}

const ReportsScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]); // <-- Typed state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("healthsync_user_token");
        const response = await axios.get<{ reports: Report[] }>(
          "https://us-central1-your-project-id.cloudfunctions.net/api/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReports(response.data.reports);
      } catch (err) {
        setError("Failed to load reports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      {loading ? (
        <div className="p-6 bg-white rounded-3xl shadow-lg text-center">
          <p className="text-gray-600">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-white rounded-3xl shadow-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : reports.length > 0 ? (
        reports.map((report) => (
          <div key={report.id} className="p-4 bg-white rounded-3xl shadow-lg mb-4">
            <h3 className="font-bold text-lg">{report.title}</h3>
            <p className="text-gray-600">{report.description}</p>
            <p className="text-sm text-gray-400">
              {new Date(report.date).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <div className="p-6 bg-white rounded-3xl shadow-lg text-center">
          <p className="text-gray-600">No reports available.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsScreen;
