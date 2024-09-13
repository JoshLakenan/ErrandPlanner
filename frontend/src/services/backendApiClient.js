import axios from "axios";

// Create an instance of axios with default configuration for the backend API
const backendApiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

// Add a request interceptor to include the token in every request
backendApiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backendApiClient;
