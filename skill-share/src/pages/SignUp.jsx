import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered:", form);
    // Later: add backend request here
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="logo">Skill Swap</h1>
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <div className="password-row">
            <div className="password-fields">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <p className="password-hint">
              Password needs at least one uppercase, lowercase, number, and
              special character. Minimum 8 characters.
            </p>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <p className="back-to-login">
            Already have an account?{" "}
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/")}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;