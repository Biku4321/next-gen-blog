
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API  = axios.create({
  baseURL: `${BASE}/api`, // ✅ all requests go to /api/
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API .interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// axios.interceptors.response.use(res => res, err => {
//   // optional: unified error handling
//   return Promise.reject(err);
// });

export default API ;
