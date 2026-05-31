import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HRAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const fetchUsers = async () => {
    try { const response = await axios.get('http://localhost:8080/api/users'); setUsers(response.data); }
    catch (error) { console.error("Error fetching users", error); }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/leave-requests/audit-logs');
      setAuditLogs(response.data);
    } catch (error) { console.error("Error fetching logs", error); }
  };

  const handleRoleChange = async (id, newRoleId) => {
    try { await axios.put(`http://localhost:8080/api/users/${id}`, { roleId: newRoleId }); alert("Role updated!"); fetchUsers(); }
    catch (error) { console.error(error); }
  };

  // NEW: Download Function
  const handleDownload = () => {
    window.location.href = 'http://localhost:8080/api/leave-requests/export';
  };

  return (
    <div style={styles.pageBg}>
      <div className="container mt-5">

        {/* UPDATED HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={styles.title}>HR Admin Dashboard</h2>
          <div>
            <button className="btn btn-success me-2" onClick={handleDownload}>
                📥 Export Leave Report
            </button>
            <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
          </div>
        </div>

        {/* Section 1: Manage Employees */}
        <div className="card mb-4" style={styles.card}>
          <div className="card-header bg-success text-white">
            <b>Manage Employees</b>
          </div>
          <div className="card-body">
            <table className="table table-striped table-hover">
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>
                    <td>
                      <select className="form-control form-control-sm" value={user.roleId} onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}>
                        <option value="1">Employee</option>
                        <option value="2">Manager</option>
                        <option value="3">HR Admin</option>
                        <option value="4">IT Admin</option>
                      </select>
                    </td>
                    <td><button className="btn btn-sm btn-outline-secondary">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: System Audit Trail */}
        <div className="card" style={styles.card}>
          <div className="card-header bg-secondary text-white">
            <b>System Audit Trail</b>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr><td colSpan="4" className="text-center text-muted">No activity recorded.</td></tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${log.action.includes('APPROVED') ? 'bg-success' : log.action.includes('REJECTED') ? 'bg-danger' : 'bg-primary'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>{log.actor}</td>
                        <td>{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageBg: {
    backgroundImage: 'url("https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh'
  },
  title: { color: '#333', fontWeight: '700', textShadow: '0 2px 4px rgba(255,255,255,0.8)' },
  card: { border: 'none', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backgroundColor: 'rgba(255,255,255,0.95)' }
};

export default HRAdminDashboard;