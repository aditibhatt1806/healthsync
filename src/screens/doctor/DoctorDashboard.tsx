import React from "react";
import { useUserData } from "../../hooks/useUserData";


const DoctorDashboard = () => {
  const { patients } = useUserData();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Patients</h1>
      <ul>
        {patients.map(p => (
          <li key={p.uid} className="p-2 border-b">
            {p.name} - {p.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
