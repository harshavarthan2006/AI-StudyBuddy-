import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Sparkles, HelpCircle, Calendar, PlusCircle, ArrowRight, Layers, FileText, ChevronRight, Compass } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [stats, setStats] = useState({
    materialsCount: 0,
    summariesCount: 0,
    flashcardsCount: 0,
    quizzesCount: 0,
    studyPlansCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [matRes, sumRes, fcRes, quizRes, planRes] = await Promise.all([
          api.get('/material'),
          api.get('/ai/summaries'),
          api.get('/ai/flashcards'),
          api.get('/ai/quizzes'),
          api.get('/ai/study-plans'),
        ]);

        setMaterials(matRes.data.data || []);
        setStats({
          materialsCount: matRes.data.count || matRes.data.data?.length || 0,
          summariesCount: sumRes.data.data?.length || 0,
          flashcardsCount: fcRes.data.count || fcRes.data.data?.length || 0,
          quizzesCount: quizRes.data.count || quizRes.data.data?.length || 0,
          studyPlansCount: planRes.data.count || planRes.data.data?.length || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container py-8">
        {/* Hero Banner */}
        <div className="dashboard-welcome card p-8 bg-gradient-banner mb-8 shadow-xl">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <span className="badge badge-dark mb-3 inline-flex items-center">
                <Sparkles size={14} className="mr-1 text-warning" /> Powered by Google Gemini AI
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-indigo-100 mt-2 max-w-xl text-base">
                Your AI study workspace is ready. Transform notes into concise summaries, flashcard decks, and revision quizzes in seconds.
              </p>
            </div>
            <Link to="/materials" className="btn btn-primary btn-lg bg-white text-dark hover:bg-gray-100 flex items-center shadow-lg">
              <PlusCircle size={20} className="text-primary mr-1" /> Upload Material
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="stat-card card p-5 border-left-primary hover-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Materials</span>
                <span className="text-3xl font-extrabold text-dark">{stats.materialsCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary flex-center">
                <FileText size={20} />
              </div>
            </div>
          </div>

          <div className="stat-card card p-5 border-left-accent hover-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Summaries</span>
                <span className="text-3xl font-extrabold text-dark">{stats.summariesCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-accent flex-center">
                <BookOpen size={20} />
              </div>
            </div>
          </div>

          <div className="stat-card card p-5 border-left-warning hover-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Flashcards</span>
                <span className="text-3xl font-extrabold text-dark">{stats.flashcardsCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-warning flex-center">
                <Layers size={20} />
              </div>
            </div>
          </div>

          <div className="stat-card card p-5 border-left-success hover-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Quizzes</span>
                <span className="text-3xl font-extrabold text-dark">{stats.quizzesCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-success flex-center">
                <HelpCircle size={20} />
              </div>
            </div>
          </div>

          <div className="stat-card card p-5 border-left-info hover-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Study Plans</span>
                <span className="text-3xl font-extrabold text-dark">{stats.studyPlansCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex-center">
                <Calendar size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="quick-actions-section mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
              <Compass size={22} className="text-primary" /> AI Learning Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={() => navigate('/materials')}
              className="action-card card p-6 hover-shadow cursor-pointer border hover:border-indigo-400 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors">Study Materials</h3>
              <p className="text-xs text-secondary mt-1">Upload notes, PDFs, or paste text to generate resources</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                Explore Notes <ChevronRight size={14} className="ml-1" />
              </div>
            </div>

            <div
              onClick={() => navigate('/resources')}
              className="action-card card p-6 hover-shadow cursor-pointer border hover:border-cyan-400 group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-accent flex-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-lg text-dark group-hover:text-accent transition-colors">AI Summaries</h3>
              <p className="text-xs text-secondary mt-1">Get instant key takeaways and exam revision summaries</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-accent">
                View Summaries <ChevronRight size={14} className="ml-1" />
              </div>
            </div>

            <div
              onClick={() => navigate('/resources')}
              className="action-card card p-6 hover-shadow cursor-pointer border hover:border-amber-400 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-warning flex-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-lg text-dark group-hover:text-warning transition-colors">Interactive Flashcards</h3>
              <p className="text-xs text-secondary mt-1">Practice key terms with 3D flip revision cards</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-warning">
                Practice Cards <ChevronRight size={14} className="ml-1" />
              </div>
            </div>

            <div
              onClick={() => navigate('/study-plan')}
              className="action-card card p-6 hover-shadow cursor-pointer border hover:border-blue-400 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="font-bold text-lg text-dark group-hover:text-blue-500 transition-colors">Personalized Study Plan</h3>
              <p className="text-xs text-secondary mt-1">Build daily roadmaps tailored to your exam schedule</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-500">
                Generate Plan <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Materials */}
        <div className="recent-materials-section card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark">Your Study Materials</h2>
              <p className="text-xs text-secondary mt-0.5">Select any material to run Gemini AI study tools</p>
            </div>
            <Link to="/materials" className="btn btn-sm btn-outline flex items-center">
              View All Materials <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching study materials..." />
          ) : materials.length === 0 ? (
            <div className="empty-state text-center py-12">
              <FileText className="text-muted mx-auto mb-3" size={48} />
              <h3 className="font-bold text-lg text-dark">No study materials uploaded yet</h3>
              <p className="text-sm text-secondary mt-1">Upload your first note or text file to generate AI resources.</p>
              <Link to="/materials" className="btn btn-primary mt-4 inline-flex items-center">
                <PlusCircle size={16} className="mr-1" /> Upload Material Now
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table w-full text-left">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Created Date</th>
                    <th className="text-right">AI Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.slice(0, 5).map((mat) => (
                    <tr key={mat._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-bold text-dark">{mat.title}</td>
                      <td>
                        <span className="badge badge-primary">{mat.subject}</span>
                      </td>
                      <td className="text-sm text-secondary">
                        {new Date(mat.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <Link to={`/materials/${mat._id}`} className="btn btn-xs btn-primary inline-flex items-center">
                          <Sparkles size={12} className="mr-1" /> AI Study Suite
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
