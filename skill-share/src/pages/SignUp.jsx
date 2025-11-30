import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const navigate = useNavigate();

  const onSubmit = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }

      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('password', password);

      try {
          await axios.post('http://localhost:8000/auth/sign-up', formData, { withCredentials: true })
          .then(() => navigate('/'));

      } catch (error) {
          // send to 404 page or show error message
          console.error('Error during sign-up:', error);
      }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="logo">Skill Swap</h1>
        <h2>Sign Up</h2>

        <form onSubmit={onSubmit} className="signup-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <div className="password-row">
            <div className="password-fields">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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