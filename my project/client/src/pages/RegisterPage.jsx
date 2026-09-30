import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, User, Mail, Lock, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page flex-center full-screen bg-gray-50 p-4">
      <div className="auth-card card p-8 max-w-md w-full shadow-lg bg-white">
        <div className="text-center mb-6">
          <BrainCircuit className="text-primary mx-auto mb-2" size={48} />
          <h1 className="text-2xl font-bold text-dark">Create Account</h1>
          <p className="text-sm text-secondary mt-1">Join LearnMate AI to boost your study performance</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4 flex items-center p-3 rounded">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label font-medium text-sm text-dark block mb-1">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-control"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label font-medium text-sm text-dark block mb-1">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-control"
                placeholder="rahul@example.com"
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-2.5" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Register as Student'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-secondary">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
