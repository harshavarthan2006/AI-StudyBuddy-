const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyMaterial',
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    examDate: {
      type: String,
      required: [true, 'Exam date is required'],
    },
    availableTime: {
      type: String,
      default: '2 hours daily',
    },
    learningGoal: {
      type: String,
      default: 'Comprehensive understanding and revision',
    },
    studyPlan: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Study plan content is required'],
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

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
module.exports = StudyPlan;
