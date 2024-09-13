import apiClient from "./backendApiClient";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
 * Checks if the client has a valid JWT token, and redirects to the login page
 * if the token is missing or invalid.
 * @param {void}
 * @returns {void}
 */
export const clientAuthCheck = () => {
  const navigate = useNavigate();

  // Get the JWT token from session storage
  const token = sessionStorage.getItem("jwt");

  // Check if token is present
  let valid = true;
  if (!token) {
    valid = false;
  }

  // Check if token is valid
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    valid = false;
  }

  // If token is not valid, remove it from session storage and redirect to login
  if (!valid) {
    sessionStorage.removeItem("jwt");
    navigate("/login", {
      replace: true,
      state: {
        alert: "Please log in to continue.",
        type: "error",
      },
    });
  }
};
