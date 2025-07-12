import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-lg hidden md:block">
        <h2 className="text-xl font-bold mb-6">My Dashboard</h2>
        <nav className="space-y-4">
          <Link to="/" className="block hover:text-blue-500">
            Dashboard
          </Link>
          <Link to="/users" className="block hover:text-blue-500">
            Users
          </Link>
          <Link to="/settings" className="block hover:text-blue-500">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
