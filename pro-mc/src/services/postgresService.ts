import { Mission } from '../types/mission';
import { User, LoginCredentials, CreateUserData, UpdateUserData } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000/api';

class PostgresService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }

    return response.json();
  }

  // Missions
  async getMissions(): Promise<Mission[]> {
    return this.request<Mission[]>('/missions');
  }

  async getMission(id: string): Promise<Mission> {
    return this.request<Mission>(`/missions/${id}`);
  }

  async createMission(mission: Omit<Mission, 'id'>): Promise<Mission> {
    return this.request<Mission>('/missions', {
      method: 'POST',
      body: JSON.stringify(mission),
    });
  }

  async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    return this.request<Mission>(`/missions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMission(id: string): Promise<void> {
    return this.request<void>(`/missions/${id}`, {
      method: 'DELETE',
    });
  }

  async updateMissionStatuses(): Promise<any> {
    return this.request<any>('/missions/update-statuses', {
      method: 'POST',
    });
  }

  // Utilisateurs
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: UpdateUserData): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Authentification
  async login(credentials: LoginCredentials): Promise<{ user: User; message: string }> {
    return this.request<{ user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Santé du serveur
  async healthCheck(): Promise<{ status: string; timestamp: string; database: string }> {
    return this.request<{ status: string; timestamp: string; database: string }>('/health');
  }
}

export const postgresService = new PostgresService();
