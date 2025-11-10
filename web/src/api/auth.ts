import { apiClient, handleApiError } from './client';
import type { AuthResponse, User } from '../types';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  isHSP: boolean;
  hspAnswers: number[];
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
