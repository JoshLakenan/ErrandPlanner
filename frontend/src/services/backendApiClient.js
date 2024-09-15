import axios from "axios";
import snakeToCamelCase from "../utils/snakeToCamelCase";

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

// Add a response interceptor to convert snake_case to camelCase in responses
backendApiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      // Convert snake_case keys to camelCase
      response.data = snakeToCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backendApiClient;
