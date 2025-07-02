import { Task, TaskStats, ApiResponse } from '../types/Task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getTasks(filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = `/api/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<Task[]>(endpoint);
    return response.data || [];
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.request<Task>(`/api/tasks/${id}`);
    if (!response.data) {
      throw new Error('Task not found');
    }
    return response.data;
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const response = await this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    
    if (!response.data) {
      throw new Error('Failed to create task');
    }
    return response.data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response.data) {
      throw new Error('Failed to update task');
    }
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<TaskStats> {
    const response = await this.request<TaskStats>('/api/stats');
    if (!response.data) {
      throw new Error('Failed to fetch statistics');
    }
    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();