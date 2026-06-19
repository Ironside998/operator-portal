// api/axiosInstance.js
// Shared axios instance for the operator dashboard.
// Automatically attaches the operator JWT to every request.

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("operator_auth");
  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;