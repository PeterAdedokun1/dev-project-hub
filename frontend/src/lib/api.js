const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getProjects: () => request('/projects'),
  createProject: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  getProject: (id) => request(`/projects/${id}`),
  updateProject: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  shipProject: (id) => request(`/projects/${id}/ship`, { method: 'PATCH' }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  createTask: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
