import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const onSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      try {
          const response = await axios.post('http://localhost:8000/auth/token', formData, { withCredentials: true})
          
          if (response.status === 200) {         
            console.log('Login successful');
            navigate('/');
          } else {
            console.error('Login failed');
          }
      } catch (error) {
          console.error('Error during login:', error);
      }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="logo">Skill Swap</h1>
        <h2>Welcome!</h2>

        <form onSubmit={onSubmit} className="login-form">
          <label>Email</label>
          <input
            type="text"
            id='email'
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            id='password'
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <button type="submit" className="login-btn" onClick={onSubmit}>
            Log In
          </button>

          <div className="divider">OR</div>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
