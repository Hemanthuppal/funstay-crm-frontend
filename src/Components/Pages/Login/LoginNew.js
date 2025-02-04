import React, { useState,useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginNew.css';
import {baseURL} from '../../Apiservices/Api';
import { AuthContext } from "../../AuthContext/AuthContext";
import { Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const userData = { email, password };
  
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        login(
          data.token,
          data.id,
          data.name,
          data.mobile,
          data.email,
          data.role,
          data.assign_manager,
          data.managerId
        ); // Use context to manage auth state
  
        // if (data.role === 'employee') {
        //   navigate('/View-lead');
        // } else if (data.role === 'manager') {
        //   navigate('/m-view-leads');
        // } else {
        //   navigate('/a-view-lead');
        // }


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
              <div className="password-input-group">
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on state */}
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-end mb-2">
            <a href="/forgot" className="forgot-password"> Forgot  Password</a>
           
          </div>
            <button className="login-btn login-btn-login">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
