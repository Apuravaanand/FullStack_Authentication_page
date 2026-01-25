// frontend/services/authService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Save auth data helper
const saveAuthData = (data) => {
  if (data?.token) localStorage.setItem("token", data.token);

  if (data?._id) {
    localStorage.setItem(
      "user",
      JSON.stringify({ _id: data._id, name: data.name, email: data.email })
    );
  }
};

// REGISTER → sends OTP (do NOT save token here)
export const registerUser = async (form) => {
  try {
    const { data } = await api.post("/register", form);
    return data;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
};

// LOGIN → after verified
export const loginUser = async (form) => {
  try {
    const { data } = await api.post("/login", form);
    saveAuthData(data);
    return data;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
};

// VERIFY OTP → user becomes verified + gets token
export const verifyOtp = async (form) => {
  try {
    const { data } = await api.post("/verify-otp", form);
    saveAuthData(data);
    return data;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
