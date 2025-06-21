import React, { useState } from "react";
import {Box, Container} from "@mui/material";
import { FaUser, FaLock } from "react-icons/fa";

const Auth = ({ onAuth }) => {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", password: "" });
  const [authError, setAuthError] = useState("");

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!authForm.name || !authForm.password) {
      setAuthError("Please fill all fields");
      return;
    }
    localStorage.setItem("user", JSON.stringify(authForm));
    onAuth(authForm);
    setAuthError("");
  };

  const handleLogin = (e) => {
  e.preventDefault();
  const saved = JSON.parse(localStorage.getItem("user"));
  if (
    saved &&
    saved.name === authForm.name.trim() &&
    saved.password === authForm.password
  ) {
    onAuth(saved);
    setAuthError("");
  } else {
    setAuthError("Invalid credentials");
  }
};

  return (
      <Container fixed align="center" maxWidth="xl" >
      <Box component="div" sx={{ width: "100%", maxWidth: 400, height: "100%", margin: "auto", padding: 5, borderRadius: 2, boxShadow: 3,  }}>
      <form onSubmit={authMode === "login" ? handleLogin : handleRegister}>
        <h2>{authMode === "login" ? "Login" : "Register"}</h2>
        {authError && <div>{authError}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={authForm.name}
          onChange={handleAuthChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={authForm.password}
          onChange={handleAuthChange}
        />
        <button type="submit">
          {authMode === "login" ? "Login" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
        >
          {authMode === "login" ? "No account? Register" : "Have an account? Login"}
        </button>
      </form>
      </Box>
      </Container>
  );
};

export default Auth;