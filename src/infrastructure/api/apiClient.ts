import axios from "axios";

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
};


const baseURL = import.meta.env.VITE_API_URL ?? "";

export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API === "true";

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // ⭐ VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});





const processQueue = (error: unknown, success: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(success);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ❌ If no response OR not 401 → reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // 🔥 SKIP auth bootstrap routes
    const isAuthRoute =
      originalRequest.url.includes("/auth/me") ||
      originalRequest.url.includes("/auth/refresh");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // ❌ Prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 🔁 If already refreshing → queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // 🔥 CALL REFRESH
      await apiClient.post("/v1/api/auth/refresh");

      processQueue(null);

      return apiClient(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      // 🔥 Logout
      window.location.href = "/";

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;