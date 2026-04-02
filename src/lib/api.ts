import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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

export default apiClient;
