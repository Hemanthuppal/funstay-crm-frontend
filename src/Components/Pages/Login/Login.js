import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      navigate('/dashboard'); // Navigate to admin path
    } else if (email === 'user@gmail.com' && password === 'user@123') {
      navigate('/sales-Dashboard'); // Navigate to user path
    } else if (email === 'manager@gmail.com' && password === 'manager@123') {
      navigate('/Manager-Dashboard'); // Navigate to manager path
    } else {
      alert('Invalid credentials');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Funstay {""}<span style={{ color: '#f9a125' }}>CRM</span></h2>
        <p className="text-center">Sign in to start your session</p>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="input-icon">
              <i className="fa fa-envelope"></i>
            </span>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="input-icon">
              <i className="fa fa-lock"></i>
            </span>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <a href="#forgot-password" className="forgot-password">I forgot my password</a>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
