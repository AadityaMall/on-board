import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080", // Update with your backend URL
});

// Attach Authorization Header Automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
