import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginNew.css';
import baseURL from '../../Apiservices/Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    };

    try {
      // Send login request to the backend
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store token and role for further use (like in localStorage or context)
        localStorage.setItem('authToken', data.token);  // Store token
        localStorage.setItem('userRole', data.role);    // Store role

        // Navigate based on role
        if (data.role === 'employee') {
          navigate('/s-dashboard');
        } else if (data.role === 'manager') {
          navigate('/m-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed');
    }
  };
 
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-side">
          <div className="login-logo-container">
            <img
              className="login-logo"
              src="https://media.licdn.com/dms/image/v2/C560BAQH-6AaMW4Bayg/company-logo_200_200/company-logo_200_200/0/1630671617216/funstay_experientialtravel_logo?e=2147483647&v=beta&t=LZ5v7JeyUIx3ruq9SQs2mC6givIiu1wPpoAZe3m3-9w"
              alt="Funstay Logo"
            />
          </div>
          <h2 className="login-tagline">Your Gateway to Unforgettable Journeys</h2>
        </div>
        <div className="login-login-side">
          <div>
            <h1 className="welcomeback">Welcome Back</h1>
            <p className="login-subtitle">Log in to start your next adventure!</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="login-input-group">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-btn login-btn-login">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
