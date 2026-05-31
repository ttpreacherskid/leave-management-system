import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import HRAdminDashboard from './HRAdminDashboard'; // NEW: Import HR Dashboard

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login Page (Default) */}
        <Route path="/" element={<Login />} />

        {/* Route for Employee Dashboard */}
        <Route path="/dashboard" element={<EmployeeDashboard />} />

        {/* Route for Manager Dashboard */}
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />

        {/* Route for HR Dashboard (NOW CORRECT) */}
        <Route path="/hr-dashboard" element={<HRAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;