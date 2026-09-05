import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1/counseling`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: `${API_BASE}/api/v1/auth`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Interceptor to attach Bearer token fallback for cross-domain Vercel/Render deployments
const attachAuth = (config) => {
  const token = sessionStorage.getItem('advisor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuth);
authApi.interceptors.request.use(attachAuth);

export async function submitCounseling(data) {
  const response = await api.post('/submit', data);
  return response.data;
}

export async function getRequests(params = {}) {
  const response = await api.get('/requests', { params });
  return response.data;
}

export async function updateStatus(id, status) {
  const response = await api.patch(`/requests/${id}/status`, { status });
  return response.data;
}

export async function updateNotes(id, notes) {
  const response = await api.patch(`/requests/${id}/notes`, { notes });
  return response.data;
}

export async function getCounts() {
  const response = await api.get('/counts');
  return response.data;
}

// Advisor Authentication API
export async function loginAdvisor(credentials) {
  const response = await authApi.post('/login', credentials);
  if (response.data?.token) {
    sessionStorage.setItem('advisor_token', response.data.token);
  }
  return response.data;
}

export async function getAuthMe() {
  const response = await authApi.get('/me');
  return response.data;
}

export async function logoutAdvisor() {
  const response = await authApi.post('/logout');
  sessionStorage.removeItem('advisor_token');
  return response.data;
}