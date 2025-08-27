import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { BarChart3, Calendar, Download, LogOut, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  universityName: string;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function DashboardHeader({ universityName, dateRange, onDateRangeChange }: DashboardHeaderProps) {
  const { logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">The Growth Index</h1>
              <p className="text-sm text-slate-600">{universityName} Dashboard</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="semester">Current Semester</option>
                <option value="year">Academic Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>

            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}