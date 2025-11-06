import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async requestMagicLink(email: string) {
    const response = await this.client.post('/auth/magic-link', { email });
    return response.data;
  }

  async verifyMagicLink(token: string) {
    const response = await this.client.post('/auth/callback', { token });
    return response.data;
  }

  // User
  async getMe() {
    const response = await this.client.get('/me');
    return response.data;
  }

  // Emotions
  async createEmotion(data: {
    emotionLabel: string;
    intensity: number;
    notes?: string;
    tags?: string[];
  }) {
    const response = await this.client.post('/emotion', data);
    return response.data;
  }

  async getEmotions(params?: { from?: string; to?: string }) {
    const response = await this.client.get('/emotion', { params });
    return response.data;
  }

  // Mascot
  async getMascotToday() {
    const response = await this.client.get('/mascot/today');
    return response.data;
  }

  // Reports
  async getWeeklyReport() {
    const response = await this.client.get('/report/weekly');
    return response.data;
  }
}

export const api = new ApiClient();
