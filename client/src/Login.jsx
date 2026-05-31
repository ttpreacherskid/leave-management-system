import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload();
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div className="card" style={styles.card}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 style={styles.title}>LMS</h2>
            <p className="text-muted">Leave Management System</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url("https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  card: {
    width: '450px',
    zIndex: 1,
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  title: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: '2.5rem',
    letterSpacing: '-1px'
  },
  input: {
    borderRadius: '10px',
    padding: '12px 20px',
    border: '1px solid #e5e7eb'
  }
};

export default Login;