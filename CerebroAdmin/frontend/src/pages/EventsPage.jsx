import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Search, Filter, ChevronDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event_type: '',
    severity: '',
    limit: 50,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.event_type) params.append('event_type', filters.event_type);
      if (filters.severity) params.append('severity', filters.severity);
      params.append('limit', filters.limit);

      const response = await axios.get(`${API_URL}/api/admin/events?${params}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      critical: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[severity] || colors.info;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10" />
            Events Tracking
          </h1>
          <p className="text-gray-300">Monitor system events and activity</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Event Type
              </label>
              <select
                value={filters.event_type}
                onChange={(e) =>
                  setFilters({ ...filters, event_type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Types</option>
                <option value="course_created">Course Created</option>
                <option value="course_completed">Course Completed</option>
                <option value="quiz_completed">Quiz Completed</option>
                <option value="error_occurred">Error Occurred</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) =>
                  setFilters({ ...filters, severity: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) =>
                  setFilters({ ...filters, limit: parseInt(e.target.value) })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="25">25 events</option>
                <option value="50">50 events</option>
                <option value="100">100 events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No events found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                            event.severity
                          )}`}
                        >
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {event.event_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm max-w-md truncate">
                        {event.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(event.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
