import axios from "axios";


const baseURL = import.meta.env.VITE_API_URL ?? "";

export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API === "true";

//  REMOVE token memory handling (not needed for cookies)
// let authToken = null;
// export const setAuthToken = (token) => { authToken = token; };
// export const clearAuthToken = () => { authToken = null; };

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // ⭐ VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});

//  REMOVE Bearer injection (cookies handle auth automatically)
// apiClient.interceptors.request.use(
//   (config) => {
//     if (authToken) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or redirect
    }
    return Promise.reject(error);
  }
);

export default apiClient;