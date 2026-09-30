const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyMaterial',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Flashcard question is required'],
    },
    answer: {
      type: String,
      required: [true, 'Flashcard answer is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
module.exports = Flashcard;
