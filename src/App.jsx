import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Dashboard />
    </div>
  );
}

export default App;
