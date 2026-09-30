import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, Sparkles, CheckCircle2, Shield, ArrowRight, Zap, Target, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-container min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="landing-header py-5 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex-center text-white shadow-lg">
              <BrainCircuit size={24} />
            </div>
            <span className="text-2xl font-extrabold text-dark tracking-tight">
              LearnMate <span className="text-gradient">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn btn-outline">Log In</Link>
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section text-center py-20 px-4 relative overflow-hidden">
        <div className="container max-w-5xl mx-auto">
          <span className="badge badge-primary mb-6 inline-flex items-center text-sm py-1.5 px-4 shadow-sm">
            <Sparkles size={16} className="mr-2 text-warning animate-spin" /> Powered by Google Gemini AI
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-dark leading-tight tracking-tight">
            Smarter Learning & Exam Revision <br />
            <span className="text-gradient">Made Effortless</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary mt-6 max-w-3xl mx-auto font-medium">
            Transform notes, textbooks, and documents into instant exam summaries, interactive 3D flashcard decks, practice quizzes, and personalized daily revision plans.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/register" className="btn btn-primary btn-lg flex items-center">
              Start Free Study Workspace <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Demo Login Credentials
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="demo-credentials-banner card card-glass p-6 mt-14 max-w-2xl mx-auto text-left border-primary/30">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <span className="badge badge-warning flex items-center gap-1">
                <Zap size={14} /> Quick Demo Access
              </span>
              <span className="text-xs text-muted font-bold">Ready to test immediately</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-primary block text-base">Student Demo</span>
                <span className="text-dark block mt-1">Email: <strong className="font-mono">rahul@example.com</strong></span>
                <span className="text-dark block">Password: <strong className="font-mono">Student@123</strong></span>
              </div>
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="font-bold text-purple-600 block text-base">Admin Demo</span>
                <span className="text-dark block mt-1">Email: <strong className="font-mono">admin@example.com</strong></span>
                <span className="text-dark block">Password: <strong className="font-mono">Admin@123</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="features-section py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Everything You Need to <span className="text-gradient">Ace Exams</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-8 text-center hover-shadow border-gradient-left-primary">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-primary flex-center mx-auto mb-5 shadow-sm">
                <BookOpen size={28} />
              </div>
              <h3 className="font-bold text-xl mb-2">AI Summaries</h3>
              <p className="text-sm text-secondary">
                Turn lengthy notes into concise key takeaways formatted for fast examination revision.
              </p>
            </div>

            <div className="card p-8 text-center hover-shadow border-gradient-left-cyan">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-accent flex-center mx-auto mb-5 shadow-sm">
                <Sparkles size={28} />
              </div>
              <h3 className="font-bold text-xl mb-2">3D Flashcards</h3>
              <p className="text-sm text-secondary">
                Master key terms and definitions with interactive 3D flip card decks.
              </p>
            </div>

            <div className="card p-8 text-center hover-shadow border-gradient-left-amber">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-warning flex-center mx-auto mb-5 shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold text-xl mb-2">Practice Quizzes</h3>
              <p className="text-sm text-secondary">
                Test your mastery with AI generated MCQs featuring detailed explanations.
              </p>
            </div>

            <div className="card p-8 text-center hover-shadow border-gradient-left-emerald">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-success flex-center mx-auto mb-5 shadow-sm">
                <Target size={28} />
              </div>
              <h3 className="font-bold text-xl mb-2">Study Roadmaps</h3>
              <p className="text-sm text-secondary">
                Generate tailored daily revision schedules based on your target exam date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center py-8 text-sm text-secondary border-t bg-white">
        <p>© 2026 LearnMate AI – AI Assistant for Smarter Learning and Study Support</p>
      </footer>
    </div>
  );
};

export default LandingPage;
