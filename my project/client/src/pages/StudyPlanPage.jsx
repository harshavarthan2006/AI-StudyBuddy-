import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import StudyPlanViewer from '../components/StudyPlanViewer';
import api from '../services/api';
import { Calendar, Clock, Target, Sparkles, PlusCircle, AlertCircle } from 'lucide-react';

const StudyPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [availableTime, setAvailableTime] = useState('2 hours daily');
  const [learningGoal, setLearningGoal] = useState('Comprehensive understanding & exam revision');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');

  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    try {
      const [plansRes, matRes] = await Promise.all([
        api.get('/ai/study-plans'),
        api.get('/material'),
      ]);
      setPlans(plansRes.data.data || []);
      setMaterials(matRes.data.data || []);
    } catch (err) {
      console.error('Failed to load study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!subject || !examDate) {
      setErrorMsg('Subject and Exam Date are required fields');
      return;
    }

    setGenerating(true);
    setErrorMsg('');

    try {
      const res = await api.post('/api/ai/study-plan', {
        subject,
        examDate,
        availableTime,
        learningGoal,
        materialId: selectedMaterialId || null,
      });

      if (res.data.success) {
        setShowForm(false);
        setSubject('');
        setExamDate('');
        fetchData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate study plan with Gemini AI');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      {generating && <LoadingSpinner fullScreen text="Creating personalized study plan..." />}

      <main className="main-content container py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark">Personalized Study Plans</h1>
            <p className="text-secondary text-sm">Custom AI revision schedules tailored to your target exam date</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle size={18} className="mr-2" /> {showForm ? 'Close Form' : 'Create New Study Plan'}
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-danger mb-4 p-4 rounded flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0 text-danger" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Generator Form */}
        {showForm && (
          <div className="card p-6 mb-8 border-primary bg-white shadow-md">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center">
              <Sparkles size={20} className="text-primary mr-2" /> Configure AI Study Plan
            </h2>

            <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label font-medium text-sm block mb-1">Subject / Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label font-medium text-sm block mb-1">Target Exam Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label font-medium text-sm block mb-1">Available Daily Study Time</label>
                <select
                  className="form-control"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                >
                  <option value="1 hour daily">1 Hour Daily</option>
                  <option value="2 hours daily">2 Hours Daily</option>
                  <option value="3-4 hours daily">3-4 Hours Daily</option>
                  <option value="5+ hours daily (Intensive)">5+ Hours Daily (Intensive)</option>
                </select>
              </div>

              <div>
                <label className="form-label font-medium text-sm block mb-1">Link to Study Material (Optional)</label>
                <select
                  className="form-control"
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                >
                  <option value="">General (No material linked)</option>
                  {materials.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="form-label font-medium text-sm block mb-1">Learning Goal</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Master tree traversals and pass end-semester exam"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="btn btn-primary btn-lg" disabled={generating}>
                  <Sparkles size={18} className="mr-2" /> Generate Plan with Gemini AI
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Plans */}
        {loading ? (
          <LoadingSpinner text="Fetching study plans..." />
        ) : plans.length === 0 ? (
          <div className="card text-center p-12">
            <Calendar className="text-muted mx-auto mb-3" size={48} />
            <h3 className="font-bold text-lg text-dark">No study plans created yet</h3>
            <p className="text-sm text-secondary mt-1">
              Generate a personalized study roadmap tailored to your target exam date.
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 inline-block">
              Generate Your First Study Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan) => (
              <StudyPlanViewer key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyPlanPage;
