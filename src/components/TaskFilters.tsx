import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  searchQuery: string;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export function TaskFilters({
  statusFilter,
  priorityFilter,
  searchQuery,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSearchChange,
  onReset,
}: TaskFiltersProps) {
  const hasActiveFilters = statusFilter || priorityFilter || searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Filter & Search</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
    </div>
  );
}