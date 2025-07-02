import React from 'react';
import { TaskStats } from '../types/Task';
import { CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  stats: TaskStats | null;
  loading: boolean;
}

export function StatsPanel({ stats, loading }: StatsPanelProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const completionRate = stats.total > 0 
    ? Math.round((stats.by_status.completed / stats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">To Do</p>
            <p className="text-2xl font-bold text-gray-900">{stats.by_status.todo}</p>
          </div>
          <Circle className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.by_status['in-progress']}</p>
          </div>
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.by_status.completed}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="text-lg font-semibold text-gray-900">{completionRate}% Complete</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={`${completionRate * 1.76} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}