import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        {isAuthenticated && (
          <Route
            path="/"
            element={
              <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports/daily" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}
        {/* Redirect to login if not authenticated */}
        <Route
          path="*"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
