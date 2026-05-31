import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [balance, setBalance] = useState(null);

  // State for calculated days
  const [calculatedDays, setCalculatedDays] = useState(0);

  useEffect(() => {
    fetchLeaveHistory();
    fetchBalance();
  }, []);

  // Effect to calculate days on the frontend
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateBusinessDays(startDate, endDate);
      setCalculatedDays(days);
    } else {
      setCalculatedDays(0);
    }
  }, [startDate, endDate]);

  const calculateBusinessDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
      return 0;
    }

    let count = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const fetchLeaveHistory = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/leave-requests/user/${user.id}`);
      setLeaveHistory(response.data);
    } catch (error) { console.log("Could not fetch history"); }
  };

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/leave-requests/balance/${user.id}`);
      setBalance(response.data);
    } catch (error) { console.log("Could not fetch balance"); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) { alert("Please select dates."); return; }
    if (new Date(endDate) < new Date(startDate)) { alert("End Date cannot be before Start Date."); return; }

    try {
      await axios.post('http://localhost:8080/api/leave-requests', {
        userId: user.id,
        leaveTypeId: 1,
        startDate: startDate,
        endDate: endDate,
        reason: reason
      });
      alert("Leave Request Submitted!");
      setStartDate(''); setEndDate(''); setReason('');
      setCalculatedDays(0);
      fetchLeaveHistory(); fetchBalance();
    } catch (error) { alert("Error submitting request"); }
  };

  if (!user) { window.location.href = "/"; return null; }

  return (
    <div className="container-fluid" style={styles.pageBg}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 style={styles.title}>Welcome back, {user.firstName}</h2>
            <p style={styles.subtitle}>Employee Portal</p>
          </div>
          <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Logout
          </button>
        </div>

        <div className="row">
          <div className="col-md-5 mb-4">
            {balance && (
              <div className="card mb-4" style={styles.card}>
                <div className="card-header" style={styles.cardHeaderBlue}>
                  <span style={styles.headerText}>My Leave Balance</span>
                </div>
                <div className="card-body text-center">
                  <h1 style={styles.bigNumber}>{balance.remaining}</h1>
                  <p className="text-muted">Days Remaining</p>
                  <div className="d-flex justify-content-around mt-3">
                    <div>
                      <h5>{balance.allocated}</h5>
                      <small className="text-muted">Allocated</small>
                    </div>
                    <div>
                      <h5 className="text-danger">{balance.used}</h5>
                      <small className="text-muted">Used</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={styles.card}>
              <div className="card-header" style={styles.cardHeaderBlue}>
                <span style={styles.headerText}>Apply for Leave</span>
              </div>
              <div className="card-body">
                <form onSubmit={handleApply}>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>

                  {/* Display Calculated Days for User Feedback */}
                  <div className="mb-3">
                    <label className="form-label">Days Requested</label>
                    <input
                      type="text"
                      className="form-control"
                      value={calculatedDays}
                      readOnly
                      style={{fontWeight: 'bold', backgroundColor: '#f8f9fa'}}
                    />
                    <small className="text-muted">Excludes weekends (Sat & Sun)</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea className="form-control" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Request</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-7 mb-4">
            <div className="card h-100" style={styles.card}>
              <div className="card-header" style={styles.cardHeaderDark}>
                <span style={styles.headerText}>My Leave History</span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    {/* REMOVED 'Days' Column from Header */}
                    <thead><tr><th>Start</th><th>End</th><th>Status</th></tr></thead>
                    <tbody>
                      {leaveHistory.length === 0 ? (
                        <tr><td colSpan="3" className="text-center text-muted">No history found</td></tr>
                      ) : (
                        leaveHistory.map((req) => (
                          <tr key={req.id}>
                            <td>{req.startDate}</td>
                            <td>{req.endDate}</td>
                            {/* REMOVED 'Days' Cell */}
                            <td>
                              <span className={`badge ${req.status === 'APPROVED' ? 'bg-success' : req.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                {req.status}
                              </span>
                            </td>
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
  cardHeaderBlue: { backgroundColor: '#eff6ff', borderBottom: 'none', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' },
  cardHeaderDark: { backgroundColor: '#f8f9fa', borderBottom: 'none', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' },
  headerText: { fontWeight: '600', color: '#495057' },
  bigNumber: { fontSize: '3.5rem', fontWeight: '700', color: '#2563eb' }
};

export default EmployeeDashboard;