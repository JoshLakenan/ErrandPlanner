import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const registerUser = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/users`, {
    username,
    password,
  });

  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/users/login`, {
    username,
    password,
  });

  return response.data;
};
