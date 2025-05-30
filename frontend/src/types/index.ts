export interface User {
  id: number;
  username: string;
  email: string;
  profileColor: string;
  isOnline?: boolean;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
} 