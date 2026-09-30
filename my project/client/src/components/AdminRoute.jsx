import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex-center full-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container p-6 text-center">
        <div className="card bg-red-light p-6 border-red">
          <h2 className="text-xl font-bold text-red">403 - Forbidden Access</h2>
          <p className="mt-2 text-secondary">
            You do not have administrative privileges to view this page. Admin access required.
          </p>
          <a href="/dashboard" className="btn btn-primary mt-4 inline-block">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
