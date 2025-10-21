import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // Later: send credentials to backend
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="logo">Skill Swap</h1>
        <h2>Welcome!</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="Enter username or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <button type="submit" className="login-btn">
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
