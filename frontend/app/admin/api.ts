const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async checkAuth() {
    const res = await fetch(`${API_BASE_URL}/admin/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store' as RequestCache
    });
    return res.json();
  },

  async createProject(project: any) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    return res.json();
  },

  async updateProject(id: string, project: any) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    return res.json();
  },

  async deleteProject(id: string) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Messages
  async getMessages() {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store' as RequestCache
    });
    return res.json();
  },

  async updateMessageStatus(id: string, read: boolean) {
    const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ read }),
    });
    return res.json();
  },

  async deleteMessage(id: string) {
    const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Public Submit Message
  async submitContactMessage(message: { name: string; email: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    return res.json();
  }
};
