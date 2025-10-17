import api from '../utils/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string; // Backend expects phoneNumber
  role: 'USER' | 'OPERATOR' | 'ADMIN'; // Backend uses uppercase
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string; // Backend returns phoneNumber
    role: 'USER' | 'OPERATOR' | 'ADMIN'; // Backend uses uppercase
    address?: string;
  };
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // Logout (optional - mainly client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
