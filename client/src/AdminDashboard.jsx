import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    roleId: 1
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users', form);
      alert("User Created Successfully! ID generated automatically.");
      setForm({ firstName: '', lastName: '', email: '', password: '', department: '', roleId: 1 });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error creating user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        alert("User Deleted.");
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert("Error deleting user.");
      }
    }
  };

  return (
    <div style={styles.pageBg}>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={styles.title}>IT Admin Dashboard</h2>
          <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Logout
          </button>
        </div>

        <div className="row">
          {/* LEFT SIDE: Create Form */}
          <div className="col-md-5">
            <div className="card" style={styles.card}>
              <div className="card-header bg-info text-white">
                <b>Create New User</b>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>First Name</label>
                    <input type="text" name="firstName" className="form-control" value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Last Name</label>
                    <input type="text" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Department</label>
                    <select name="department" className="form-control" value={form.department} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="IT">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Admin">Admin</option>
                      <option value="Accounts">Accounts</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Role</label>
                    <select name="roleId" className="form-control" value={form.roleId} onChange={handleChange}>
                      <option value="1">Employee</option>
                      <option value="2">Manager</option>
                      <option value="3">HR Admin</option>
                      <option value="4">IT Admin</option>
                      <option value="5">Accountant</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Create User</button>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: User List & Delete */}
          <div className="col-md-7">
            <div className="card" style={styles.card}>
              <div className="card-header bg-secondary text-white">
                <b>System Users</b>
              </div>
              <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td><small>{user.employeeId}</small></td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>
                          <span className={`badge ${user.roleId === 1 ? 'bg-primary' : user.roleId === 2 ? 'bg-success' : user.roleId === 5 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {user.roleId === 1 ? 'Employee' : user.roleId === 2 ? 'Manager' : user.roleId === 5 ? 'Accountant' : 'Admin'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
  title: { color: '#333', fontWeight: '700', textShadow: '0 2px 4px rgba(255,255,255,0.8)' },
  card: { border: 'none', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backgroundColor: 'rgba(255,255,255,0.95)' }
};

export default AdminDashboard;