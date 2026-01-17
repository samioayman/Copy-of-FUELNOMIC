import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Card from "../Card.jsx";
import bgImage from "../assets/GetStarted2Image.jpg";
import RegisterCard from "../RegisterCard.jsx";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // 1. Sign up using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    // 2. Insert admin details into admins table
    if (data?.user) {
      const { error: adminError } = await supabase
        .from("admin_profiles")
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ]);

      if (adminError) {
        setMessage(adminError.message);
        return;
      }

      setMessage("Admin account created successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("");

      // Optional redirect
      // navigate("/login");
    }
  };

  return (
    <div
      className="register-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RegisterCard>
        <h1 className="fuelnomicTittle">FUELNOMIC</h1>
        <h2 className="card-title">Register</h2>

        {message && <p className="error-message">{message}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <select
          className="modern-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
    Select Role
  </option>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Superadmin</option>
          </select>
          <button type="submit" className="btn primary-btn">
            Create Account
          </button>
        </form>

        <p className="register-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </RegisterCard>
    </div>
  );
}

export default Register;
