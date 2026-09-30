const express = require('express');
const router = express.Router();
const {
  generateMaterialFlashcards,
  generateMaterialQuiz,
  generatePersonalizedStudyPlan,
  getSummaries,
  getFlashcards,
  getQuizzes,
  getStudyPlans,
  getMaterialResources,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/flashcards', protect, generateMaterialFlashcards);
router.post('/quiz', protect, generateMaterialQuiz);
router.post('/study-plan', protect, generatePersonalizedStudyPlan);

router.get('/summaries', protect, getSummaries);
router.get('/flashcards', protect, getFlashcards);
router.get('/quizzes', protect, getQuizzes);
router.get('/study-plans', protect, getStudyPlans);
router.get('/material/:materialId/resources', protect, getMaterialResources);

module.exports = router;
