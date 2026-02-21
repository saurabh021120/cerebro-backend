import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AnalyticsPage = () => {
  const [courseAnalytics, setCourseAnalytics] = useState([]);
  const [userEngagement, setUserEngagement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/analytics/courses`),
        axios.get(`${API_URL}/api/admin/analytics/users`),
      ]);
      setCourseAnalytics(coursesRes.data);
      setUserEngagement(usersRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-300">
            Analyze platform performance and user engagement
          </p>
        </div>

        {/* Course Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Course Performance
          </h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            {courseAnalytics.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No course data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={courseAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="course_title"
                    stroke="#ffffff"
                    tick={{ fill: '#ffffff' }}
                  />
                  <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total_enrollments"
                    fill="#8b5cf6"
                    name="Enrollments"
                  />
                  <Bar
                    dataKey="completion_rate"
                    fill="#ec4899"
                    name="Completion Rate %"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Course Details Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Course Details</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            {courseAnalytics.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No course data available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Course
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Enrollments
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Avg Progress
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Completion Rate
                      </th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                        Last Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseAnalytics.map((course) => (
                      <tr
                        key={course.course_id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {course.course_title}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {course.total_enrollments}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {course.average_progress}%
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              course.completion_rate >= 50
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {course.completion_rate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {course.last_activity
                            ? new Date(course.last_activity).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Popular Courses */}
        {userEngagement?.most_popular_courses &&
          userEngagement.most_popular_courses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6" />
                Most Popular Courses
              </h2>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={userEngagement.most_popular_courses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ title, enrollments }) =>
                        `${title}: ${enrollments}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="enrollments"
                    >
                      {userEngagement.most_popular_courses.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
