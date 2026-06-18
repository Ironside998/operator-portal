// context/AuthContext.jsx
// Provides authentication state globally across the operator dashboard.
// Stores JWT token and operator username after login.
// Replace the mock check in login() with an axios.post() call
// when the real backend is ready.

import React, { createContext, useContext, useState } from "react";
import { mockOperator } from "../mock/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("operator_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username, password) => {
    // --- MOCK CHECK ---
    // Replace with:
    // const res = await axios.post("/api/auth/operator/login", { username, password });
    // const { token, username } = res.data;
    if (
      username === mockOperator.username &&
      password === mockOperator.password
    ) {
      const session = {
        token: mockOperator.token,
        username: mockOperator.username,
        role: mockOperator.role,
      };
      localStorage.setItem("operator_auth", JSON.stringify(session));
      setAuth(session);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password." };
  };

  const logout = () => {
    localStorage.removeItem("operator_auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}