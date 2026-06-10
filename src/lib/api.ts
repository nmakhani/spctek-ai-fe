import axios from 'axios';

import { debugConsole } from './debug';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_DEV_MODE === '1' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PROD;

const DEPLOYMENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

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
		debugConsole.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
			status: response.status,
			data: response.data,
		});
		return response;
	},
	(error) => {
		debugConsole.error(`🔥 [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});

		const status = error.response?.status;

		if (status === 401) {
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
	list: (params?: { detail?: boolean }) => apiClient.get('/contacts', { params }),
	get: (id: string, params?: { detail?: boolean }) => apiClient.get(`/contacts/${id}`, { params }),
	create: (data: Record<string, unknown>) => apiClient.post('/contacts', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/contacts/${id}`, data),
	delete: (id: string) => apiClient.delete(`/contacts/${id}`),
};

export type ContentType = 'BLOG' | 'CASE_STUDY';

export type ContentLookupField = 'slug' | 'uuid';

export const contentApi = {
	list: (params: {
		type: ContentType;
		search?: string;
		category?: string;
		author?: string;
		skip?: number;
		limit?: number;
	}) => apiClient.get('/content', { params }),
	get: (id: string, type: ContentType, lookup_field: ContentLookupField = 'uuid') =>
		apiClient.get(`/content/${id}`, { params: { type, lookup_field } }),
	create: (data: Record<string, unknown>) => apiClient.post('/content', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/content/${id}`, data),
	delete: (id: string) => apiClient.delete(`/content/${id}`),
};

export const categoriesApi = {
	list: () => apiClient.get('/categories'),
	get: (id: string) => apiClient.get(`/categories/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/categories', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/categories/${id}`, data),
	delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

export const statusesApi = {
	list: () => apiClient.get('/statuses'),
	get: (id: string) => apiClient.get(`/statuses/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/statuses', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.put(`/statuses/${id}`, data),
	delete: (id: string) => apiClient.delete(`/statuses/${id}`),
};

export const authApi = {
	me: () => apiClient.get('/auth/me'),
	login: (data: Record<string, unknown>) => apiClient.post('/auth/login', data),
};

export const reinstatementApi = {
	generateReport: (data: Record<string, unknown>) => apiClient.post('/reinstatement/generate', data),
	createLog: (data: Record<string, unknown>) => apiClient.post('/reinstatement/logs', data),
	listLogs: (contactId: string) => apiClient.get(`/reinstatement/logs/${contactId}`),
	generateReportFromLog: (data: Record<string, unknown>) => apiClient.post('/reinstatement/generate-from-log', data),
};

export const authorsApi = {
	list: () => apiClient.get('/authors'),
	get: (id: string) => apiClient.get(`/authors/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/authors', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/authors/${id}`, data),
	delete: (id: string) => apiClient.delete(`/authors/${id}`),
};

export const r2Api = {
	getUploadUrl: (data: { filename: string; content_type: string }) => apiClient.post('/get-upload-url', data),
};

export const metadeckApi = {
	list: () => apiClient.get('/metadeck'),
	get: (id: string) => apiClient.get(`/metadeck/${id}`),
	getByPath: (path: string) => apiClient.get(`/metadeck/page/${path}`),
	create: (data: Record<string, unknown>) => apiClient.post('/metadeck', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/metadeck/${id}`, data),
	delete: (id: string) => apiClient.delete(`/metadeck/${id}`),
};

export const popupsApi = {
	list: () => apiClient.get('/popups'),
	get: (id: string) => apiClient.get(`/popups/${id}`),
	getByPath: (path: string) => apiClient.get('/popups/by-path', { params: { path } }),
	create: (data: Record<string, unknown>) => apiClient.post('/popups', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/popups/${id}`, data),
	delete: (id: string) => apiClient.delete(`/popups/${id}`),
};

export const automationWorkflowsApi = {
	list: () => apiClient.get('/automation-workflows'),
	get: (id: string) => apiClient.get(`/automation-workflows/${id}`),
	create: (data: Record<string, unknown>) => apiClient.post('/automation-workflows', data),
	update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/automation-workflows/${id}`, data),
	delete: (id: string) => apiClient.delete(`/automation-workflows/${id}`),
};

export const deploymentApi = {
	status: () => axios.get(`${DEPLOYMENT_API_BASE_URL}/deploy/status`),
	run: (data: { password: string }) => axios.post(`${DEPLOYMENT_API_BASE_URL}/deploy`, data),
};

export default apiClient;
