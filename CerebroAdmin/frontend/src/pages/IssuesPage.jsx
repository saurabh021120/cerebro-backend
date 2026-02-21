import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, Plus, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
  });

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await axios.get(`${API_URL}/api/admin/issues?${params}`);
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/issues`, newIssue);
      setShowCreateModal(false);
      setNewIssue({
        title: '',
        description: '',
        priority: 'medium',
        category: 'other',
      });
      fetchIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/admin/issues/${issueId}`, {
        status: newStatus,
      });
      fetchIssues();
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || colors.open;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <AlertCircle className="w-10 h-10" />
              Issues Management
            </h1>
            <p className="text-gray-300">Track and manage system issues</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Issue
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-white py-8">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No issues found</div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {issue.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {issue.description || 'No description'}
                    </p>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status.replace(/_/g, ' ')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-500/20 text-gray-400 border-gray-500/30">
                        {issue.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {issue.status === 'open' && (
                      <button
                        onClick={() =>
                          updateIssueStatus(issue.id, 'in_progress')
                        }
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Start
                      </button>
                    )}
                    {issue.status === 'in_progress' && (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Created: {new Date(issue.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Issue Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Create New Issue
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newIssue.title}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, title: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Issue title"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Description
                  </label>
                  <textarea
                    value={newIssue.description}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-24"
                    placeholder="Describe the issue"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Priority
                  </label>
                  <select
                    value={newIssue.priority}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, priority: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Category
                  </label>
                  <select
                    value={newIssue.category}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, category: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="bug">Bug</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                    <option value="ui_ux">UI/UX</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  onClick={createIssue}
                  disabled={!newIssue.title}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Issue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;
