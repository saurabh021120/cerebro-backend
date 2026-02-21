import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Users,
  AlertTriangle,
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/analytics/overview`),
        axios.get(`${API_URL}/api/admin/analytics/events`),
      ]);
      setOverview(overviewRes.data);
      setEventStats(eventsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Courses',
      value: overview?.total_courses || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/my-courses'),
    },
    {
      title: 'Total Events',
      value: overview?.total_events || 0,
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/admin/events'),
    },
    {
      title: 'Open Issues',
      value: overview?.open_issues || 0,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      onClick: () => navigate('/admin/issues'),
    },
    {
      title: 'Recent Events',
      value: overview?.recent_events_count || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/admin/events'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Cerebro Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Monitor events, track issues, and analyze platform performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={stat.onClick}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-300 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/events')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            <Activity className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold mb-1">View Events</h3>
            <p className="text-blue-100 text-sm">
              Track system events and activity
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/issues')}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 hover:from-orange-700 hover:to-red-700 transition-all"
          >
            <AlertCircle className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold mb-1">Manage Issues</h3>
            <p className="text-orange-100 text-sm">
              Create and track system issues
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/analytics')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <TrendingUp className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold mb-1">View Analytics</h3>
            <p className="text-purple-100 text-sm">
              Analyze platform performance
            </p>
          </button>
        </div>

        {/* Event Statistics */}
        {eventStats && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Event Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">
                  By Severity
                </h3>
                <div className="space-y-2">
                  {Object.entries(eventStats.events_by_severity || {}).map(
                    ([severity, count]) => (
                      <div
                        key={severity}
                        className="flex justify-between items-center bg-white/5 rounded-lg p-3"
                      >
                        <span className="text-gray-300 capitalize">
                          {severity}
                        </span>
                        <span className="text-white font-semibold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">
                  Recent Alerts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-white font-semibold">
                        {eventStats.recent_errors || 0} Errors
                      </p>
                      <p className="text-gray-400 text-sm">Last 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-semibold">
                        {eventStats.recent_warnings || 0} Warnings
                      </p>
                      <p className="text-gray-400 text-sm">Last 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
