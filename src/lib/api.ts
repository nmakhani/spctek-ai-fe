import axios from 'axios';

import { debugConsole } from './debug';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_DEV_MODE === '1'
		? process.env.NEXT_PUBLIC_API_URL_DEV
		: process.env.NEXT_PUBLIC_API_URL_PROD;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
});

debugConsole.log('🔧 DEV MODE =', process.env.NEXT_PUBLIC_DEV_MODE);
debugConsole.log('🔧 BASE URL =', API_BASE_URL);

apiClient.interceptors.request.use(
	(config) => {
		debugConsole.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
			data: config.data,
			params: config.params,
		});

		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('auth_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		debugConsole.error('❌ [API Request Error]', error);
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		debugConsole.log(
			`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
			{
				status: response.status,
				data: response.data,
			}
		);
		return response;
	},
	(error) => {
		debugConsole.error(
			`🔥 [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
			{
				status: error.response?.status,
				data: error.response?.data,
				message: error.message,
			}
		);

		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('auth_token');
				localStorage.removeItem('auth_user');
				window.open('/portal/login', '_self');
			}
		}
		return Promise.reject(error);
	}
);

export const contactsApi = {
	list: () => apiClient.get('/contacts'),
	get: (id: string) => apiClient.get(`/contacts/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/contacts', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/contacts/${id}`, data),
	delete: (id: string) => apiClient.delete(`/contacts/${id}`),
};

export const blogsApi = {
	list: () => apiClient.get('/blogs'),
	get: (id: string) => apiClient.get(`/blogs/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/blogs', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/blogs/${id}`, data),
	delete: (id: string) => apiClient.delete(`/blogs/${id}`),
};

export const authApi = {
	login: (data: Record<string, unknown>) => apiClient.post('/auth/login', data),
};

export const reinstatementApi = {
	generateReport: (data: Record<string, unknown>) =>
		apiClient.post('/reinstatement/generate', data),
};

export default apiClient;
