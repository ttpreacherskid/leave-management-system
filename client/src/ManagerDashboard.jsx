import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ManagerDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { fetchPending(); fetchPrediction(); fetchHistory(); }, []);

  const fetchPending = async () => {
    try { const response = await axios.get('http://localhost:8080/api/leave-requests/pending'); setPendingRequests(response.data); }
    catch (error) { console.error(error); }
  };

  const fetchPrediction = async () => {
    try { const response = await axios.get('http://localhost:8080/api/leave-requests/analytics/prediction'); setPrediction(response.data); }
    catch (error) { console.error(error); }
  };

  const fetchHistory = async () => {
    try { const response = await axios.get('http://localhost:8080/api/leave-requests/analytics/history'); setHistory(response.data); }
    catch (error) { console.error(error); }
  };

  const handleApprove = async (id) => {
    try { await axios.put(`http://localhost:8080/api/leave-requests/${id}/approve`); alert("Approved!"); fetchPending(); }
    catch (error) { console.error(error); }
  };

  const handleReject = async (id) => {
    try { await axios.put(`http://localhost:8080/api/leave-requests/${id}/reject`); alert("Rejected!"); fetchPending(); }
    catch (error) { console.error(error); }
  };

  // NEW: Download Function
  const handleDownload = () => {
    window.location.href = 'http://localhost:8080/api/leave-requests/export';
  };

  return (
    <div className="container-fluid" style={styles.pageBg}>
      <div className="container py-4">

        {/* UPDATED HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 style={styles.title}>Manager Dashboard</h2>
            <p style={styles.subtitle}>Team Overview & Analytics</p>
          </div>
          <div>
            <button className="btn btn-success me-2" onClick={handleDownload}>
                📥 Download Report
            </button>
            <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100 p-4" style={styles.card}>
              <h5 className="text-uppercase text-muted mb-4">AI Prediction (Next Month)</h5>
              {prediction ? (
                <>
                  {prediction.is_department_specific ? (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead><tr><th>Dept</th><th>Pred</th><th>Risk</th></tr></thead>
                        <tbody>
                          {prediction.department_predictions.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.department}</td>
                              <td><b>{item.predicted_days}</b></td>
                              <td>
                                <span className={`badge ${item.risk_level === 'High' ? 'bg-danger' : 'bg-success'}`}>
                                  {item.risk_level}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h1 style={styles.bigNumber}>{prediction.predicted_leave_days}</h1>
                      <p>Days Expected</p>
                      <span className={`badge p-2 ${prediction.risk_level === 'High' ? 'bg-danger' : 'bg-success'}`}>
                        Risk: {prediction.risk_level}
                      </span>
                    </div>
                  )}
                </>
              ) : <p className="text-center">Loading prediction...</p>}
            </div>
          </div>

          <div className="col-md-8 mb-3">
            <div className="card h-100 p-4" style={styles.card}>
              <h5 className="text-uppercase text-muted mb-4">Leave Trends (Historical)</h5>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={styles.card}>
          <div className="card-header py-3" style={styles.cardHeaderDark}>
            <span style={styles.headerText}>Pending Approvals</span>
          </div>
          <div className="card-body">
            {pendingRequests.length === 0 ? (
              <div className="text-center text-muted py-5">No pending requests.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date Range</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.id}>
                        <td><span className="fw-bold">ID: {req.userId}</span></td>
                        <td>{req.startDate} <br/> <small className="text-muted">to {req.endDate}</small></td>
                        <td>{req.reason}</td>
                        <td>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(req.id)}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
  title: { fontWeight: '700', color: '#333' },
  subtitle: { color: '#6c757d', marginBottom: '0' },
  card: { border: 'none', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' },
  cardHeaderDark: { backgroundColor: '#f8f9fa', borderBottom: 'none' },
  headerText: { fontWeight: '600', color: '#495057' },
  bigNumber: { fontSize: '4rem', fontWeight: '700', color: '#2563eb' }
};

export default ManagerDashboard;