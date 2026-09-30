import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import FlashcardViewer from '../components/FlashcardViewer';
import QuizViewer from '../components/QuizViewer';
import api from '../services/api';
import { BookOpen, Sparkles, HelpCircle, Layers, ArrowRight } from 'lucide-react';

const ResourceHistoryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [flashcardGroups, setFlashcardGroups] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('summaries'); // 'summaries' | 'flashcards' | 'quizzes'

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [sumRes, fcRes, quizRes] = await Promise.all([
          api.get('/ai/summaries'),
          api.get('/ai/flashcards'),
          api.get('/ai/quizzes'),
        ]);

        setSummaries(sumRes.data.data || []);
        setQuizzes(quizRes.data.data || []);

        // Group flashcards by materialId
        const fcMap = {};
        (fcRes.data.data || []).forEach((fc) => {
          const matId = fc.materialId?._id || 'general';
          if (!fcMap[matId]) {
            fcMap[matId] = {
              materialTitle: fc.materialId?.title || 'Study Material',
              subject: fc.materialId?.subject || 'General',
              cards: [],
            };
          }
          fcMap[matId].cards.push(fc);
        });
        setFlashcardGroups(Object.values(fcMap));
      } catch (err) {
        console.error('Failed to load AI resource history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark">AI Generated Resource History</h1>
            <p className="text-secondary text-sm">Review previously generated summaries, flashcards, and quizzes</p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="tabs-container flex border-b mb-6">
          <button
            onClick={() => setActiveCategory('summaries')}
            className={`tab-btn ${activeCategory === 'summaries' ? 'active' : ''}`}
          >
            <BookOpen size={16} className="mr-1.5" /> Summaries ({summaries.length})
          </button>
          <button
            onClick={() => setActiveCategory('flashcards')}
            className={`tab-btn ${activeCategory === 'flashcards' ? 'active' : ''}`}
          >
            <Sparkles size={16} className="mr-1.5" /> Flashcard Decks ({flashcardGroups.length})
          </button>
          <button
            onClick={() => setActiveCategory('quizzes')}
            className={`tab-btn ${activeCategory === 'quizzes' ? 'active' : ''}`}
          >
            <HelpCircle size={16} className="mr-1.5" /> Practice Quizzes ({quizzes.length})
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching AI resource history..." />
        ) : (
          <div className="history-content-wrapper">
            {activeCategory === 'summaries' && (
              <div className="space-y-6">
                {summaries.length === 0 ? (
                  <div className="card text-center p-8">
                    <p className="text-secondary">No AI summaries generated yet.</p>
                  </div>
                ) : (
                  summaries.map((sum) => (
                    <div key={sum._id} className="card p-6 hover-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="badge badge-primary mr-2">
                            {sum.materialId?.subject || 'Subject'}
                          </span>
                          <h3 className="text-lg font-bold text-dark inline-block">
                            {sum.materialId?.title || 'Saved Summary'}
                          </h3>
                        </div>
                        <span className="text-xs text-muted">
                          {new Date(sum.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="prose text-sm text-secondary whitespace-pre-wrap bg-gray-50 p-4 rounded border">
                        {sum.summary}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeCategory === 'flashcards' && (
              <div className="space-y-6">
                {flashcardGroups.length === 0 ? (
                  <div className="card text-center p-8">
                    <p className="text-secondary">No flashcards created yet.</p>
                  </div>
                ) : (
                  flashcardGroups.map((group, idx) => (
                    <div key={idx} className="card p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="badge badge-warning mr-2">{group.subject}</span>
                          <h3 className="text-lg font-bold text-dark inline-block">{group.materialTitle}</h3>
                        </div>
                        <span className="text-xs text-muted">{group.cards.length} Flashcards</span>
                      </div>
                      <FlashcardViewer flashcards={group.cards} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeCategory === 'quizzes' && (
              <div className="space-y-6">
                {quizzes.length === 0 ? (
                  <div className="card text-center p-8">
                    <p className="text-secondary">No quizzes generated yet.</p>
                  </div>
                ) : (
                  quizzes.map((q) => (
                    <div key={q._id} className="card p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="badge badge-success mr-2">
                            {q.materialId?.subject || 'Subject'}
                          </span>
                          <h3 className="text-lg font-bold text-dark inline-block">
                            {q.materialId?.title || 'Practice Quiz'}
                          </h3>
                        </div>
                        <span className="text-xs text-muted">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <QuizViewer questions={q.questions} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceHistoryPage;
