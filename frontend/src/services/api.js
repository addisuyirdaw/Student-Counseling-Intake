import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/counseling',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: '/api/v1/auth',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

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
  return response.data;
}

export async function getAuthMe() {
  const response = await authApi.get('/me');
  return response.data;
}

export async function logoutAdvisor() {
  const response = await authApi.post('/logout');
  return response.data;
}