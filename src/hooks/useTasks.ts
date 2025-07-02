import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats } from '../types/Task';
import { apiService } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await apiService.getTasks(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      // Fallback to mock data for demo purposes
      setTasks([
        {
          id: '1',
          title: 'Design the new homepage',
          description: 'Create mockups and wireframes for the company homepage redesign',
          status: 'in-progress',
          priority: 'high',
          created_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Setup CI/CD pipeline',
          description: 'Configure automated testing and deployment pipeline',
          status: 'todo',
          priority: 'medium',
          created_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Write API documentation',
          description: 'Document all REST API endpoints with examples',
          status: 'completed',
          priority: 'low',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const fetchedStats = await apiService.getStats();
      setStats(fetchedStats);
    } catch (err) {
      // Fallback stats for demo
      setStats({
        total: tasks.length,
        by_status: {
          todo: tasks.filter(t => t.status === 'todo').length,
          'in-progress': tasks.filter(t => t.status === 'in-progress').length,
          completed: tasks.filter(t => t.status === 'completed').length,
        },
        by_priority: {
          low: tasks.filter(t => t.priority === 'low').length,
          medium: tasks.filter(t => t.priority === 'medium').length,
          high: tasks.filter(t => t.priority === 'high').length,
        },
      });
    }
  }, [tasks]);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await apiService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      // Fallback for demo
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        created_at: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await apiService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      // Fallback for demo
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      ));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await apiService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      // Fallback for demo
      setTasks(prev => prev.filter(task => task.id !== id));
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    tasks,
    stats,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}