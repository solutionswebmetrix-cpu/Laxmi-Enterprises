import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, IdCard, Upload, TrendingUp, FileDown, Database, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCards: 0,
    recentUploads: 0,
    pendingCards: 0
  });

  const [pendingStudents, setPendingStudents] = useState([]);

  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: user?.schoolName || '',
    schoolTagline: user?.schoolTagline || ''
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/students');
      const students = res.data;
      const pending = students.filter(s => s.cardStatus === 'Pending');
      setPendingStudents(pending);
      setStats({
        totalStudents: students.length,
        totalCards: students.filter(s => s.cardStatus !== 'Pending').length,
        recentUploads: students.filter(s => {
          const createdDate = new Date(s.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        }).length,
        pendingCards: pending.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    if (user?.role === 'admin') {
      fetchSchoolSettings();
    }
  }, []);

  const fetchSchoolSettings = async () => {
    try {
      const res = await axios.get('/api/auth/school-settings');
      setSchoolSettings(res.data);
    } catch (err) {
      console.error('Error fetching school settings:', err);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await axios.get('/api/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting students:', err);
      alert('Failed to export student data.');
    } finally {
      setExportLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'ID Cards Generated',
      value: stats.totalCards,
      icon: IdCard,
      color: 'bg-green-500'
    },
    {
      title: 'Pending ID Cards',
      value: stats.pendingCards,
      icon: Database,
      color: 'bg-orange-500'
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: Upload,
      color: 'bg-purple-500'
    },
    {
      title: 'System Status',
      value: 'Active',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the School ID Card Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role !== 'admin' && (
            <a
              href="/dashboard/students"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Students</h3>
                <p className="text-sm text-gray-600">Add, edit, or delete student records</p>
              </div>
            </a>
          )}

          {user?.role === 'admin' && pendingStudents.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IdCard className="text-orange-600" /> Students Waiting for ID Cards
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingStudents.slice(0, 5).map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-full object-cover" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                          <a href="/dashboard/id-generator" className="text-blue-600 hover:text-blue-900">Go to Generator</a>
                          {user?.role === 'admin' && (
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this student?')) {
                                  try {
                                    await axios.delete(`/api/students/${student._id}`);
                                    fetchStats();
                                  } catch (err) {
                                    console.error('Error deleting student:', err);
                                    alert('Failed to delete student.');
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete student"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pendingStudents.length > 5 && (
                  <div className="mt-4 text-center">
                    <a href="/dashboard/id-generator" className="text-sm text-blue-600 font-bold hover:underline">View all {pendingStudents.length} pending cards</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {user?.role === 'admin' && (
            <a
              href="/dashboard/id-generator"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <IdCard className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Generate ID Cards</h3>
                <p className="text-sm text-gray-600">Create and customize student ID cards</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="text-indigo-600" /> Data Export (Excel)
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Download complete records of students including their details and photo links.
          </p>
          <div className="max-w-md">
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all group"
            >
              <FileDown className={`w-6 h-6 text-blue-600 ${exportLoading ? 'animate-bounce' : 'group-hover:scale-110'}`} />
              <div className="text-left">
                <h3 className="font-bold text-blue-900">Export Student Data</h3>
                <p className="text-xs text-blue-700">Download Excel with photo links</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;