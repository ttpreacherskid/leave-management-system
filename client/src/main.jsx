import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // <--- ADD THIS LINE
import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import ManagerDashboard from './ManagerDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx'; // IT Admin
import HRAdminDashboard from './HRAdminDashboard.jsx'; // HR Admin
import AccountantDashboard from './AccountantDashboard.jsx'; // NEW: Accountant

const user = JSON.parse(localStorage.getItem('user'));

const renderScreen = () => {
  if (!user) return <Login />;

  // ROLE 5 = Accountant -> Sees Payroll Calculator
  if (user.roleId === 5) {
    return <AccountantDashboard />;
  }

  // ROLE 3 = HR Admin -> Sees User Management Table
  if (user.roleId === 3) {
    return <HRAdminDashboard />;
  }

  // ROLE 4 = IT Admin -> Sees Create User Form
  if (user.roleId === 4) {
    return <AdminDashboard />;
  }

  // ROLE 2 = Manager -> Sees Prediction & Approvals
  if (user.roleId === 2) {
    return <ManagerDashboard />;
  }

  // ROLE 1 = Employee -> Sees Apply Form (Default)
  return <Dashboard />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {renderScreen()}
  </React.StrictMode>,
);