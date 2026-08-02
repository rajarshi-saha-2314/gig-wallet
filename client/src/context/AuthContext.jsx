import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  async function signup({ name, email, password }) {
    const { data } = await axiosClient.post("/auth/signup", { name, email, password });
    persistSession(data);
  }

  async function login({ email, password }) {
    const { data } = await axiosClient.post("/auth/login", { email, password });
    persistSession(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function persistSession({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  const value = { user, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
