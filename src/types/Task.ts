export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
  due_date?: string;
}

export interface TaskStats {
  total: number;
  by_status: {
    todo: number;
    'in-progress': number;
    completed: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  timestamp: string;
}