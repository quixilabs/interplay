import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { BarChart3, Calendar, LogOut, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  universityName: string;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function DashboardHeader({ universityName, dateRange, onDateRangeChange }: DashboardHeaderProps) {
  const { logout } = useAuthStore();

  return (
    <header className="bg-white shadow-brand border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-navy" />
            <div>
              <h1 className="text-xl font-bold text-navy font-primary">Interplay</h1>
              <p className="text-sm text-warm-gray font-primary">{universityName} Dashboard</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-warm-gray" />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="border border-gray-300 rounded-brand px-3 py-2 text-sm font-primary focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
              >
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="semester">Current Semester</option>
                <option value="year">Academic Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button className="p-2 text-warm-gray hover:text-navy transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 text-warm-gray hover:text-navy transition-colors font-primary"
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