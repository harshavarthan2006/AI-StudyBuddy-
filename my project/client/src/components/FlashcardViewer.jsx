import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Sparkles, CheckCircle } from 'lucide-react';

const FlashcardViewer = ({ flashcards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="card text-center p-8">
        <Sparkles className="text-muted mx-auto mb-2" size={32} />
        <p className="text-secondary">No flashcards available for this study material yet.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / flashcards.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="flashcard-container">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs font-semibold text-secondary mb-1">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flashcard-header">
        <span className="badge badge-primary flex items-center gap-1">
          <Sparkles size={12} /> Interactive Revision
        </span>
        <span className="flip-hint-pill">
          <RotateCw size={14} /> Click card to flip
        </span>
      </div>

      <div
        className={`flashcard-scene ${isFlipped ? 'is-flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner">
          {/* Front (Question) */}
          <div className="flashcard-face flashcard-front">
            <span className="card-label question-label">QUESTION</span>
            <p className="card-text">{currentCard.question}</p>
            <div className="flip-button">
              <RotateCw size={16} /> Click to reveal answer
            </div>
          </div>

          {/* Back (Answer) */}
          <div className="flashcard-face flashcard-back">
            <span className="card-label answer-label">ANSWER</span>
            <p className="card-text">{currentCard.answer}</p>
            <div className="flip-button text-primary">
              <RotateCw size={16} /> Click to show question
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button
          onClick={handlePrev}
          className="btn btn-outline"
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="btn btn-secondary"
        >
          <RotateCw size={16} /> Flip Card
        </button>

        <button
          onClick={handleNext}
          className="btn btn-primary"
          disabled={flashcards.length <= 1}
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
