import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import FlashcardViewer from '../components/FlashcardViewer';
import QuizViewer from '../components/QuizViewer';
import api from '../services/api';
import { BookOpen, Sparkles, HelpCircle, ArrowLeft, RefreshCw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const MaterialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [summary, setSummary] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState(null);

  const [loadingMaterial, setLoadingMaterial] = useState(true);
  const [aiActionLoading, setAiActionLoading] = useState(false);
  const [aiLoadingText, setAiLoadingText] = useState('');

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'flashcards' | 'quiz' | 'content'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMaterialAndResources = async () => {
    try {
      setLoadingMaterial(true);
      const [matRes, resRes] = await Promise.all([
        api.get(`/material/${id}`),
        api.get(`/ai/material/${id}/resources`),
      ]);

      setMaterial(matRes.data.data);
      if (resRes.data.success) {
        setSummary(resRes.data.data.summary);
        setFlashcards(resRes.data.data.flashcards || []);
        setQuiz(resRes.data.data.quiz);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load study material resources');
    } finally {
      setLoadingMaterial(false);
    }
  };

  useEffect(() => {
    fetchMaterialAndResources();
  }, [id]);

  const handleGenerateSummary = async () => {
    if (aiActionLoading) return;
    setAiActionLoading(true);
    setAiLoadingText('Generating summary...');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post(`/materials/${id}/summarize`);
      if (res.data.success) {
        setSummary(res.data.data);
        setSuccessMsg('Summary generated successfully!');
        setActiveTab('summary');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate summary with Gemini AI');
    } finally {
      setAiActionLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (aiActionLoading) return;
    setAiActionLoading(true);
    setAiLoadingText('Creating flashcards...');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/ai/flashcards', { materialId: id });
      if (res.data.success) {
        setFlashcards(res.data.data);
        setSuccessMsg('Flashcards generated successfully!');
        setActiveTab('flashcards');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate flashcards with Gemini AI');
    } finally {
      setAiActionLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (aiActionLoading) return;
    setAiActionLoading(true);
    setAiLoadingText('Generating quiz...');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/ai/quiz', { materialId: id });
      if (res.data.success) {
        setQuiz(res.data.data);
        setSuccessMsg('Quiz generated successfully!');
        setActiveTab('quiz');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate quiz with Gemini AI');
    } finally {
      setAiActionLoading(false);
    }
  };

  if (loadingMaterial) {
    return (
      <div className="app-layout">
        <Navbar />
        <LoadingSpinner fullScreen text="Loading Study Material..." />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="container py-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Material Not Found</h2>
          <Link to="/materials" className="btn btn-primary mt-4 inline-block">
            Back to Materials
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />

      {aiActionLoading && <LoadingSpinner fullScreen text={aiLoadingText} />}

      <main className="main-content container py-8">
        <Link to="/materials" className="inline-flex items-center text-sm font-semibold text-primary mb-4 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to Materials List
        </Link>

        {/* Material Header */}
        <div className="material-detail-header card p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <span className="badge badge-primary mb-2">{material.subject}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-dark">{material.title}</h1>
              <p className="text-xs text-muted mt-1">
                Uploaded on {new Date(material.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* AI Generator Buttons */}
            <div className="ai-buttons-group flex flex-wrap gap-2">
              <button
                onClick={handleGenerateSummary}
                className="btn btn-primary flex items-center"
                disabled={aiActionLoading}
              >
                <BookOpen size={16} className="mr-1.5" />
                {summary ? 'Regenerate Summary' : 'Generate Summary'}
              </button>

              <button
                onClick={handleGenerateFlashcards}
                className="btn btn-warning flex items-center"
                disabled={aiActionLoading}
              >
                <Sparkles size={16} className="mr-1.5" />
                {flashcards.length > 0 ? 'Regenerate Flashcards' : 'Generate Flashcards'}
              </button>

              <button
                onClick={handleGenerateQuiz}
                className="btn btn-success flex items-center"
                disabled={aiActionLoading}
              >
                <HelpCircle size={16} className="mr-1.5" />
                {quiz ? 'Regenerate Quiz' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="alert alert-danger mb-4 p-4 rounded flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0 text-danger" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success mb-4 p-4 rounded flex items-center bg-green-50 border border-green-200 text-success">
            <CheckCircle2 size={18} className="mr-2 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Workspace Tabs */}
        <div className="tabs-container flex border-b mb-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          >
            <BookOpen size={16} className="mr-1.5" /> Summary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          >
            <Sparkles size={16} className="mr-1.5" /> Flashcards ({flashcards.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          >
            <HelpCircle size={16} className="mr-1.5" /> Practice Quiz {quiz ? '✓' : ''}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          >
            <FileText size={16} className="mr-1.5" /> Full Text Content
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="tab-content-wrapper">
          {activeTab === 'summary' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
                <BookOpen size={20} className="text-primary mr-2" /> AI Generated Summary
              </h2>
              {summary ? (
                <div className="prose max-w-none text-secondary whitespace-pre-wrap leading-relaxed">
                  {summary.summary}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary mb-4">No summary generated yet for this material.</p>
                  <button onClick={handleGenerateSummary} className="btn btn-primary inline-flex items-center">
                    <Sparkles size={16} className="mr-2" /> Generate Summary with Gemini AI
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
                <Sparkles size={20} className="text-warning mr-2" /> Interactive Study Flashcards
              </h2>
              {flashcards.length > 0 ? (
                <FlashcardViewer flashcards={flashcards} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary mb-4">No flashcards created yet for this study material.</p>
                  <button onClick={handleGenerateFlashcards} className="btn btn-warning inline-flex items-center">
                    <Sparkles size={16} className="mr-2" /> Generate Flashcards with Gemini AI
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
                <HelpCircle size={20} className="text-success mr-2" /> Multiple-Choice Revision Quiz
              </h2>
              {quiz && quiz.questions ? (
                <QuizViewer questions={quiz.questions} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary mb-4">No practice quiz generated for this material yet.</p>
                  <button onClick={handleGenerateQuiz} className="btn btn-success inline-flex items-center">
                    <Sparkles size={16} className="mr-2" /> Generate Quiz with Gemini AI
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
                <FileText size={20} className="text-primary mr-2" /> Original Material Text
              </h2>
              <div className="p-4 bg-gray-50 rounded border text-sm text-secondary whitespace-pre-wrap">
                {material.content}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MaterialDetailPage;
