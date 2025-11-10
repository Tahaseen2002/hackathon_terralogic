import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tasks API
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getStats: () => api.get('/tasks/stats'),
  getOverview: () => api.get('/tasks/overview'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

// Projects API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data)
};

// Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// AI API
export const aiAPI = {
  summarize: (forceRefresh = false) => api.post('/ai/summarize', { forceRefresh }),
  query: (query) => api.post('/ai/query', { query }),
  predict: (forceRefresh = false) => api.post('/ai/predict', { forceRefresh }),
  sentiment: () => api.post('/ai/sentiment'),
  bottlenecks: () => api.post('/ai/bottlenecks'),
  dailySummary: () => api.post('/ai/daily-summary'),
  hourlyMetrics: (forceRefresh = false) => api.post('/ai/hourly-metrics', { forceRefresh })
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
