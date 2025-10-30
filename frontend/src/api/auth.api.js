import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = (data) => {
    return axios.post(`${BASE_URL}/login`, data);
};

export const register = (data) => {
    return axios.post(`${BASE_URL}/register`, data);
}

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}`}
    };
}

export const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Vui lòng đăng nhập");
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      localStorage.removeItem("token");
      toast.error("Phiên đăng nhập đã hết hạn");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    toast.error("Token không hợp lệ");
    return false;
  }
};
