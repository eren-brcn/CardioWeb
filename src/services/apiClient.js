import axios from "axios";
import { API_URL } from "../config/api";
import { clearAuthSession, getAuthToken } from "./authStorage";

const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401 && currentPath !== "/login") {
      clearAuthSession();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
