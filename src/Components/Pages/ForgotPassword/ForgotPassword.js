import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ForgotPassword.css";

const Forgot = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add your password update logic here (e.g., validate fields, API call)

    // On successful password update, navigate to a new path, e.g., "/login"
    navigate("/");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-image-side">
        <div className="forgot-logo-container">
          <img
            className="forgot-logo"
            src="https://media.licdn.com/dms/image/v2/C560BAQH-6AaMW4Bayg/company-logo_200_200/company-logo_200_200/0/1630671617216/funstay_experientialtravel_logo?e=2147483647&v=beta&t=LZ5v7JeyUIx3ruq9SQs2mC6givIiu1wPpoAZe3m3-9w"
            alt="Funstay Logo"
          />
        </div>
      </div>
      <div className="forgot-reset-side">
        <h1>Welcome Back</h1>
        <p className="forgot-subtitle">Welcome back! Please enter your details.</p>
        <form onSubmit={handleSubmit}>
          <div className="forgot-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="forgot-input-group">
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="forgot-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="forgot-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="forgot-btn" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
