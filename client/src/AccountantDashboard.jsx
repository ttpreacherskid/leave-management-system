import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccountantDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCalculate = async () => {
    if (!selectedUser) return alert("Select an employee");
    try {
      const res = await axios.get(`http://localhost:8080/api/payroll/calculate/${selectedUser}?month=${month}&year=${year}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error calculating payroll");
    }
  };

  return (
    <div style={styles.pageBg}>
      <div className="container mt-5">
        <div className="d-flex justify-content-between mb-4">
          <h2 style={styles.title}>Accounts Department - Payroll Calculator</h2>
          <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Logout
          </button>
        </div>

        <div className="row">
          {/* LEFT: Input Form */}
          <div className="col-md-5">
            <div className="card" style={styles.card}>
              <div className="card-header bg-dark text-white">
                <b>Calculate Monthly Salary</b>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label>Select Employee</label>
                  <select className="form-control" onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">-- Select --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.employeeId})</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Month</label>
                  <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Year</label>
                  <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>

                <button className="btn btn-primary w-100" onClick={handleCalculate}>
                  Calculate Salary
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Result */}
          <div className="col-md-7">
            {result ? (
              <div className="card" style={styles.card}>
                <div className="card-header bg-success text-white">
                  <b>Pay Slip - {result.month}/{result.year}</b>
                </div>
                <div className="card-body">
                  <h4>Employee: {result.employeeName}</h4>
                  <hr />
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><b>Base Salary:</b></td>
                        <td className="text-end">${result.baseSalary.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td><b>Leave Taken (This Month):</b></td>
                        <td className="text-end">{result.daysTaken} Days</td>
                      </tr>
                      <tr>
                        <td><b>Unpaid Leave:</b></td>
                        <td className="text-end text-danger">{result.unpaidDays} Days</td>
                      </tr>
                      <tr>
                        <td><b>Deduction:</b></td>
                        <td className="text-end text-danger">- ${result.deduction.toFixed(2)}</td>
                      </tr>
                      <tr className="table-primary">
                        <td><h4><b>Net Salary:</b></h4></td>
                        <td className="text-end"><h4><b>${result.netSalary.toFixed(2)}</b></h4></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                Select an employee and month, then click Calculate.
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
  title: { color: '#333', fontWeight: '700', textShadow: '0 2px 4px rgba(255,255,255,0.8)' },
  card: { border: 'none', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backgroundColor: 'rgba(255,255,255,0.95)' }
};

export default AccountantDashboard;