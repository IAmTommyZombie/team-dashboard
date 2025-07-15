import React, { useState, useMemo } from "react";
import UserTable from "../components/UserTable";
import AddUserModal from "../components/AddUserModal";
import usersData from "../data/team.json";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [users, setUsers] = useState(usersData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddUserModal = () => setIsAddModalOpen(true);
  const closeAddUserModal = () => setIsAddModalOpen(false);
  const handleAddUser = (newUser) => {
    setUsers((old) => [...old, newUser]);
  };

  // Pie Chart Calculations
  const roleCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const statusCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const roleChartData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ["#3B82F6", "#10B981", "#EF4444", "#F59E0B"],
        borderColor: ["#1E3A8A", "#065F46", "#991B1B", "#B45309"],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#10B981", // (Active)
          "#F59E0B", // (Pending)
          "#EF4444", // (Inactive)
        ],
        borderColor: ["#065F46", "#B45309", "#991B1B"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: document.documentElement.classList.contains("dark")
            ? "#D1D5DB"
            : "#374151",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-950 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Team Management Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Role Distribution
            </h2>
            <div className="h-64">
              <Pie data={roleChartData} options={chartOptions} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Status Distribution
            </h2>
            <div className="h-64">
              <Pie data={statusChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <UserTable
          data={users}
          setData={setUsers}
          onAddUserClick={openAddUserModal}
        />
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={closeAddUserModal}
          onAddUser={handleAddUser}
          users={users}
        />
      </div>
    </div>
  );
}
