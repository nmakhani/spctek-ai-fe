import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DEV_MODE === "1"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

console.log(
  "Dev Mode:",
  process.env.NEXT_PUBLIC_DEV_MODE,
  process.env.NEXT_PUBLIC_DEV_MODE === "1",
);

console.log("API Base URL:", API_BASE_URL);

type ApiPayload = Record<string, unknown>;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses by redirecting to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.open("/portal/login", "_self");
      }
    }
    return Promise.reject(error);
  },
);

export const contactsApi = {
  list: () => apiClient.get("/contacts/"),
  get: (id: string) => apiClient.get(`/contacts/${id}`),
  create: (data: ApiPayload) => apiClient.post("/contacts/", data),
  update: (id: string, data: ApiPayload) =>
    apiClient.put(`/contacts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/contacts/${id}`),
};

export const blogsApi = {
  list: () => apiClient.get("/blogs/"),
  get: (id: string) => apiClient.get(`/blogs/${id}`),
  create: (data: ApiPayload) => apiClient.post("/blogs/", data),
  update: (id: string, data: ApiPayload) => apiClient.put(`/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/blogs/${id}`),
};

export const authApi = {
  login: (data: ApiPayload) => apiClient.post("/auth/login", data),
};

export default apiClient;
