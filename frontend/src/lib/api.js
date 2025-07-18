import axios from "axios";

// Base URL for all API requests
const BASE_URL = "http://127.0.0.1:8000/api/";

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the Authorization header with Bearer token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // Get the saved token from localStorage
  if (token) {
    // If token exists, add it to the request headers
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Return the modified config so the request can proceed
});

// Login function - sends username and password to get a JWT token
// Uses raw axios because the user is not logged in yet (no token available)
export const login = (username, password) => {
  return axios.post("http://localhost:8000/api/token/", {
    username,
    password,
  });
};

// Register function - sends user data to create a new account
// Also uses raw axios because the user is not logged in yet
export const register = (data) => {
  return axios.post(`${BASE_URL}users/create/`, data);
};

// Function to check if a username is available
// Encodes the username to safely include it in the URL query parameters
// Uses raw axios because this is a public check, no auth required
export async function checkUsernameAvailability(username) {
  try {
    const response = await axios.get(
      `${BASE_URL}users/check-username/?username=${encodeURIComponent(
        username
      )}`
    );
    // Assuming the API returns an object like { available: true }
    return response.data.available;
  } catch (error) {
    // If error occurs, assume username is taken to prevent registration
    return false;
  }
}

// Function to check if an email is available
// Also encodes the email for URL safety and uses raw axios (no auth)
export async function checkEmailAvailability(email) {
  try {
    const response = await axios.get(
      `${BASE_URL}users/check-email/?email=${encodeURIComponent(email)}`
    );
    return response.data.available;
  } catch (error) {
    // On error, assume email is taken to avoid issues
    return false;
  }
}

// Update user function
export async function updateUser(userId, userData) {
  return api.put(`users/${userId}/`, userData);
}

export default api;
