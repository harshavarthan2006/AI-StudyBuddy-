import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw, Award } from 'lucide-react';

const QuizViewer = ({ questions = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="card text-center p-8">
        <HelpCircle className="text-muted mx-auto mb-2" size={32} />
        <p className="text-secondary">No quiz questions generated for this material yet.</p>
      </div>
    );
  }

  const handleSelectOption = (qIndex, option) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: option,
    });
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="quiz-container space-y-6">
      {submitted && (
        <div className="quiz-score-banner card p-8 text-center bg-gradient-subtle border-primary shadow-lg">
          <div className="w-16 h-16 rounded-full bg-warning-light text-warning flex-center mx-auto mb-3">
            <Trophy size={36} />
          </div>
          <h2 className="text-2xl font-bold text-dark">Quiz Completed!</h2>
          <p className="text-lg text-secondary mt-1">
            You scored <span className="text-primary font-bold text-2xl">{score}</span> / {questions.length} ({percentage}%)
          </p>
          <div className="mt-4">
            <button onClick={handleRetake} className="btn btn-primary inline-flex items-center">
              <RotateCcw size={16} className="mr-2" /> Retake Practice Quiz
            </button>
          </div>
        </div>
      )}

      <div className="questions-list space-y-6">
        {questions.map((q, qIdx) => {
          const isSelected = selectedAnswers[qIdx];
          const isCorrect = isSelected === q.correctAnswer;

          return (
            <div
              key={q._id || qIdx}
              className={`question-card card p-6 transition-all duration-200 ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : ''
              }`}
            >
              <div className="question-header mb-4">
                <h3 className="font-bold text-lg text-dark flex items-start gap-2">
                  <span className="badge badge-primary flex-shrink-0 mt-0.5">Q{qIdx + 1}</span>
                  <span>{q.question}</span>
                </h3>
              </div>

              <div className="options-grid">
                {q.options.map((option, optIdx) => {
                  let optStyle = 'option-btn';
                  if (isSelected === option) optStyle += ' selected';

                  if (submitted) {
                    if (option === q.correctAnswer) {
                      optStyle += ' correct-option';
                    } else if (isSelected === option && option !== q.correctAnswer) {
                      optStyle += ' wrong-option';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      className={optStyle}
                      onClick={() => handleSelectOption(qIdx, option)}
                      disabled={submitted}
                    >
                      <span className="opt-letter-box">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="flex-1 font-medium">{option}</span>
                      {submitted && option === q.correctAnswer && (
                        <CheckCircle2 size={20} className="text-success ml-2 flex-shrink-0" />
                      )}
                      {submitted && isSelected === option && option !== q.correctAnswer && (
                        <XCircle size={20} className="text-danger ml-2 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="explanation-box mt-4 p-4 rounded-xl bg-gray-50 border-l-4 border-primary">
                  <div className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
                    <HelpCircle size={14} /> Explanation
                  </div>
                  <p className="text-sm text-secondary">{q.explanation || 'Option derived from core study content.'}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="quiz-actions flex justify-end pt-4">
          <button
            onClick={handleSubmitQuiz}
            className="btn btn-primary btn-lg"
            disabled={Object.keys(selectedAnswers).length === 0}
          >
            Submit Quiz Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
