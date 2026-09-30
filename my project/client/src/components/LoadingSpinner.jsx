import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Processing...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-card">
          <div className="spinner-icon-wrapper">
            <Loader2 className="animate-spin text-primary" size={40} />
            <Sparkles className="sparkle-overlay" size={20} />
          </div>
          <h3 className="loading-title">{text}</h3>
          <p className="loading-subtitle">Gemini AI is analyzing your study content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-center p-4">
      <Loader2 className="animate-spin text-primary mr-2" size={20} />
      <span className="text-secondary font-medium">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
