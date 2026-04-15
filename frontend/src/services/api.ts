import axios from 'axios';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

if (!process.env.REACT_APP_API_ENDPOINT) {
  console.error('[api.ts] REACT_APP_API_ENDPOINT is not configured. API calls will fail.');
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('No auth session found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  getHealthScore: () => api.get('/health-score'),

  getRisks: (params?: any) => api.get('/risks', { params }),
  getRiskById: (id: string) => api.get(`/risks/${id}`),
  updateRiskStatus: (id: string, status: string) => api.patch(`/risks/${id}`, { status }),

  getPredictions: (params?: any) => api.get('/predictions', { params }),
  getDelayPredictions: () => api.get('/predictions/delays'),
  getWorkloadPredictions: () => api.get('/predictions/workload'),

  uploadDocument: (file: File, metadata: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDocuments: (params?: any) => api.get('/documents', { params }),
  getDocumentInsights: (id: string) => api.get(`/documents/${id}/insights`),

  semanticSearch: (query: string, filters?: any) =>
    api.post('/search', { query, filters }),

  generateReport: (config: any) => api.post('/reports/generate', config),
  getReports: () => api.get('/reports'),
  downloadReport: (id: string) =>
    api.get(`/reports/${id}/download`, { responseType: 'blob' }),

  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.patch(`/notifications/${id}/read`),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),

  getUserProfile: () => api.get('/user/profile'),
  updateUserProfile: (data: any) => api.patch('/user/profile', data),

  getProjects: () => api.get('/projects'),
  getProjectById: (id: string) => api.get(`/projects/${id}`),

  getDashboardData: () => api.get('/dashboard'),
  getMetrics: (timeRange?: string) =>
    api.get('/metrics', { params: { timeRange } }),
};

export default api;
