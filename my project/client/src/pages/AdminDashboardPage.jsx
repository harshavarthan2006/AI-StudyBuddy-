import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { Users, Shield, FileText, BookOpen, Sparkles, HelpCircle, Calendar, Trash2, UserCheck, AlertCircle, Activity } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load administrator metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
      return;
    }

    try {
      const res = await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      setSuccessMsg(res.data.message || `Updated ${user.name} role to ${newRole}`);
      fetchAdminData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name} (${user.email}) and all their study materials?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${user._id}`);
      setSuccessMsg(res.data.message || 'User deleted successfully');
      fetchAdminData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <LoadingSpinner fullScreen text="Loading Administrator Control Panel..." />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container py-8">
        <div className="admin-header card p-6 bg-dark text-white mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="badge badge-warning mb-2 inline-flex items-center">
                <Shield size={14} className="mr-1" /> Admin Authorization Mode
              </span>
              <h1 className="text-3xl font-bold text-white">System Administration Dashboard</h1>
              <p className="text-gray-300 text-sm mt-1">
                Monitor system usage, review AI generation activity, and manage user accounts & roles
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block uppercase">Total System Accounts</span>
              <span className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="alert alert-danger mb-4 p-4 rounded flex items-center">
            <AlertCircle size={18} className="mr-2 text-danger" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success mb-4 p-4 rounded text-sm text-success bg-green-50 border border-green-200">
            {successMsg}
          </div>
        )}

        {/* Overview Stats Cards Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card card p-5 border-left-primary">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Registered Users</span>
                <h3 className="text-2xl font-bold text-dark mt-1">{stats?.totalUsers || 0}</h3>
                <span className="text-xs text-secondary">{stats?.totalStudents || 0} Students / {stats?.totalAdmins || 0} Admins</span>
              </div>
              <Users size={32} className="text-primary opacity-80" />
            </div>
          </div>

          <div className="stat-card card p-5 border-left-accent">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Study Materials</span>
                <h3 className="text-2xl font-bold text-dark mt-1">{stats?.totalMaterials || 0}</h3>
                <span className="text-xs text-secondary">User Uploaded Notes</span>
              </div>
              <FileText size={32} className="text-accent opacity-80" />
            </div>
          </div>

          <div className="stat-card card p-5 border-left-warning">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Summaries & Flashcards</span>
                <h3 className="text-2xl font-bold text-dark mt-1">
                  {(stats?.totalSummaries || 0) + (stats?.totalFlashcards || 0)}
                </h3>
                <span className="text-xs text-secondary">{stats?.totalSummaries || 0} Summaries / {stats?.totalFlashcards || 0} Cards</span>
              </div>
              <Sparkles size={32} className="text-warning opacity-80" />
            </div>
          </div>

          <div className="stat-card card p-5 border-left-success">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Quizzes & Study Plans</span>
                <h3 className="text-2xl font-bold text-dark mt-1">
                  {(stats?.totalQuizzes || 0) + (stats?.totalStudyPlans || 0)}
                </h3>
                <span className="text-xs text-secondary">{stats?.totalQuizzes || 0} Quizzes / {stats?.totalStudyPlans || 0} Plans</span>
              </div>
              <Activity size={32} className="text-success opacity-80" />
            </div>
          </div>
        </div>

        {/* User Account Management Table */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark flex items-center">
              <Users size={20} className="text-primary mr-2" /> Registered User Accounts
            </h2>
            <span className="badge badge-secondary">{users.length} Total Users</span>
          </div>

          <div className="table-responsive">
            <table className="table w-full text-left">
              <thead>
                <tr className="border-b text-xs text-muted uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-dark">{u.name}</td>
                    <td className="py-3 px-4 text-sm text-secondary">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="btn btn-xs btn-outline"
                        title="Toggle Admin / Student Role"
                      >
                        <UserCheck size={14} className="mr-1" />
                        {u.role === 'admin' ? 'Set as Student' : 'Make Admin'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="btn btn-xs btn-danger"
                        title="Delete User Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
            <Activity size={20} className="text-accent mr-2" /> Recent Upload Activity
          </h2>
          {stats?.recentMaterials && stats.recentMaterials.length > 0 ? (
            <div className="space-y-3">
              {stats.recentMaterials.map((mat) => (
                <div key={mat._id} className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-dark">{mat.title}</h4>
                    <span className="text-xs text-muted">
                      Uploaded by: {mat.userId?.name || 'User'} ({mat.userId?.email || 'N/A'}) • Subject: {mat.subject}
                    </span>
                  </div>
                  <span className="text-xs text-secondary">
                    {new Date(mat.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">No recent material activity logged.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
