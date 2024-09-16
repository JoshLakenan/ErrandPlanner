import apiClient from "./backendApiClient";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (username, password) => {
  const response = await apiClient.post("/users", {
    username,
    password,
  });

  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await apiClient.post("/users/login", {
    username,
    password,
  });

  return response.data;
};

/**
 * Checks if the client has a valid JWT token, and returns it if it is valid,
 * or returns false if it is not.
 * @param {void}
 * @returns {object|null} - Decoded jwt token if valid, null if not
 */
export const clientAuthCheck = () => {
  // Get the JWT token from session storage
  const token = sessionStorage.getItem("jwt");

  // Check if token is present
  let valid = true;
  if (!token) {
    valid = false;
    return null;
  }

  // Check if token is expired
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    valid = false;
  }

  // If token is not valid, remove it from session storage and redirect to login
  if (!valid) {
    sessionStorage.removeItem("jwt");
  }

  return valid ? decodedToken : null;
};
