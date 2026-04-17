import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);

export default api;