import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Sparkles, LayoutDashboard, FileText, Calendar, Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  // Get user initial
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="brand-logo">
          <div className="brand-icon-box">
            <BrainCircuit size={22} />
          </div>
          <span>LearnMate <span className="brand-badge">AI</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/materials" className={`nav-link ${isActive('/materials') ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Materials</span>
          </Link>
          <Link to="/study-plan" className={`nav-link ${isActive('/study-plan') ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>Study Plan</span>
          </Link>
          <Link to="/resources" className={`nav-link ${isActive('/resources') ? 'active' : ''}`}>
            <Sparkles size={18} />
            <span>AI Suite</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-link admin-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        <div className="user-profile-menu">
          <div className="user-badge">
            <div className="user-avatar">{userInitial}</div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Log Out">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
