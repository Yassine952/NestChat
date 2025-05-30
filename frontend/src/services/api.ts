import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profileColor: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { profileColor: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  getOnlineUsers: async () => {
    const response = await api.get('/users/online');
    return response.data;
  },
};

export const chatAPI = {
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get('/chat/messages');
    return response.data;
  },
};

export default api; 