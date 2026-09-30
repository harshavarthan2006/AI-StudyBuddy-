import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Lock, Mail, AlertCircle, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemoStudent = () => {
    setEmail('rahul@example.com');
    setPassword('Student@123');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@example.com');
    setPassword('Admin@123');
  };

  return (
    <div className="auth-page flex-center full-screen bg-gray-50 p-4">
      <div className="auth-card card p-8 max-w-md w-full shadow-lg bg-white">
        <div className="text-center mb-6">
          <BrainCircuit className="text-primary mx-auto mb-2" size={48} />
          <h1 className="text-2xl font-bold text-dark">Welcome Back</h1>
          <p className="text-sm text-secondary mt-1">Log in to access your LearnMate AI workspace</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4 flex items-center p-3 rounded">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label font-medium text-sm text-dark block mb-1">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label font-medium text-sm text-dark block mb-1">Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-2.5" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-shortcuts mt-6 pt-4 border-t text-center">
          <span className="text-xs text-muted block mb-2 font-medium">QUICK DEMO ACCESSIBILITY</span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleFillDemoStudent}
              className="btn btn-xs btn-outline flex items-center"
            >
              <UserCheck size={14} className="mr-1" /> Student Demo
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="btn btn-xs btn-outline flex items-center"
            >
              <UserCheck size={14} className="mr-1" /> Admin Demo
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
