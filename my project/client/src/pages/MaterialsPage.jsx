import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { FileText, PlusCircle, Trash2, Edit3, Eye, Sparkles, Upload, Search, AlertCircle } from 'lucide-react';

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/material');
      setMaterials(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setSubject('');
    setContent('');
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (mat) => {
    setEditId(mat._id);
    setTitle(mat.title);
    setSubject(mat.subject);
    setContent(mat.content);
    setFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (editId) {
        // Edit material
        await api.put(`/material/${editId}`, { title, subject, content });
        setSuccessMsg('Study material updated successfully');
      } else {
        // Upload/Create new material
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subject', subject);
        formData.append('content', content);
        if (file) {
          formData.append('file', file);
        }

        await api.post('/material/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg('Study material uploaded successfully');
      }

      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save study material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material and all its AI generated resources?')) {
      return;
    }
    try {
      await api.delete(`/material/${id}`);
      fetchMaterials();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete material');
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark">Study Materials</h1>
            <p className="text-secondary text-sm">Upload, organize, and manage your study notes</p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary flex items-center">
            <PlusCircle size={18} className="mr-2" /> Upload Material
          </button>
        </div>

        {successMsg && (
          <div className="alert alert-success mb-4 p-3 rounded text-sm text-success bg-green-50 border border-green-200">
            {successMsg}
          </div>
        )}

        {/* Search Bar */}
        <div className="card p-4 mb-6">
          <div className="input-icon-wrapper max-w-md">
            <Search className="input-icon text-muted" size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Materials List */}
        {loading ? (
          <LoadingSpinner text="Fetching study materials..." />
        ) : filteredMaterials.length === 0 ? (
          <div className="card text-center p-12">
            <FileText className="text-muted mx-auto mb-3" size={48} />
            <h3 className="font-bold text-lg text-dark">No study materials found</h3>
            <p className="text-sm text-secondary mt-1">Get started by uploading your first study material or note.</p>
            <button onClick={openCreateModal} className="btn btn-primary mt-4 inline-block">
              Upload Material Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => (
              <div key={mat._id} className="material-card card p-6 flex flex-col justify-between hover-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-primary">{mat.subject}</span>
                    <span className="text-xs text-muted">
                      {new Date(mat.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-dark mb-2">{mat.title}</h3>
                  <p className="text-sm text-secondary line-clamp-3 mb-4">
                    {mat.content.substring(0, 150)}...
                  </p>
                  {mat.fileName && (
                    <span className="text-xs text-primary font-medium block mb-4 flex items-center">
                      <Upload size={12} className="mr-1" /> Attachment: {mat.fileName}
                    </span>
                  )}
                </div>

                <div className="material-card-actions pt-4 border-t flex items-center justify-between">
                  <Link to={`/materials/${mat._id}`} className="btn btn-primary btn-sm flex items-center">
                    <Sparkles size={14} className="mr-1" /> AI Study Suite
                  </Link>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(mat)}
                      className="btn-icon"
                      title="Edit Material"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(mat._id)}
                      className="btn-icon text-danger"
                      title="Delete Material"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card card p-6 max-w-lg w-full bg-white shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                {editId ? 'Edit Study Material' : 'Upload New Study Material'}
              </h2>

              {error && (
                <div className="alert alert-danger mb-4 p-3 text-sm flex items-center rounded">
                  <AlertCircle size={16} className="mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label font-medium text-sm block mb-1">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Chapter 4: Data Structures"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label font-medium text-sm block mb-1">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Science / Biology"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label font-medium text-sm block mb-1">Study Text / Notes Content</label>
                  <textarea
                    className="form-control h-32"
                    placeholder="Paste or type study text here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required={!file}
                  ></textarea>
                </div>

                {!editId && (
                  <div>
                    <label className="form-label font-medium text-sm block mb-1">
                      Optional Document File (.txt, .pdf, .md)
                    </label>
                    <input
                      type="file"
                      className="form-control p-1 text-sm"
                      accept=".txt,.pdf,.md,.doc,.docx"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editId ? 'Update Material' : 'Upload Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MaterialsPage;
