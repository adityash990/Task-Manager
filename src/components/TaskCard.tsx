import React from 'react';
import { Task } from '../types/Task';
import { Clock, AlertCircle, CheckCircle2, Circle, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(task.priority)} p-6 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const nextStatus = task.status === 'todo' 
                ? 'in-progress' 
                : task.status === 'in-progress' 
                ? 'completed' 
                : 'todo';
              onStatusChange(task.id, nextStatus);
            }}
            className="hover:scale-110 transition-transform duration-150"
          >
            {getStatusIcon(task.status)}
          </button>
          <div>
            <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} mt-1`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-150"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span className={`inline-block w-2 h-2 rounded-full ${
            task.priority === 'high' ? 'bg-red-500' : 
            task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
          }`}></span>
          <span className="capitalize">{task.priority} priority</span>
        </div>

        {task.due_date && (
          <div className={`flex items-center space-x-1 ${isOverdue(task.due_date) ? 'text-red-600' : ''}`}>
            {isOverdue(task.due_date) && <AlertCircle className="w-3 h-3" />}
            <Clock className="w-3 h-3" />
            <span>Due {formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}