import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Task } from './types/Task';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { StatsPanel } from './components/StatsPanel';

function App() {
  const { tasks, stats, loading, error, createTask, updateTask, deleteTask, fetchTasks } = useTasks();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Apply filters
  useEffect(() => {
    let filtered = tasks;

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createTask(taskData);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await updateTask(id, { status });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setSearchQuery('');
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-lg text-gray-600">Organize your work and boost productivity</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <strong>Note:</strong> Backend is running in demo mode. {error}
            </p>
          </div>
        )}

        {/* Stats Panel */}
        <StatsPanel stats={stats} loading={loading} />

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Tasks ({filteredTasks.length})
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Filters */}
        <TaskFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          searchQuery={searchQuery}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onSearchChange={setSearchQuery}
          onReset={resetFilters}
        />

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {tasks.length === 0 
                  ? 'Get started by creating your first task'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        />
      </div>
    </div>
  );
}

export default App;