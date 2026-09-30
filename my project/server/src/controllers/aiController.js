const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');
const geminiService = require('../services/geminiService');

// @desc    Generate AI Summary for a study material
// @route   POST /api/materials/:id/summarize
// @access  Private
const generateMaterialSummary = async (req, res, next) => {
  try {
    const materialId = req.params.id || req.body.materialId;

    if (!materialId) {
      return res.status(400).json({
        success: false,
        message: 'Material ID is required',
      });
    }

    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    // Ownership check
    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this study material',
      });
    }

    // Call Gemini AI
    const summaryText = await geminiService.generateSummary(
      material.content,
      material.title,
      material.subject
    );

    // Save or update existing summary
    let summaryObj = await Summary.findOne({
      userId: req.user._id,
      materialId: material._id,
    });

    if (summaryObj) {
      summaryObj.summary = summaryText;
      await summaryObj.save();
    } else {
      summaryObj = await Summary.create({
        userId: req.user._id,
        materialId: material._id,
        summary: summaryText,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      data: summaryObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Flashcards for a study material
// @route   POST /api/ai/flashcards
// @access  Private
const generateMaterialFlashcards = async (req, res, next) => {
  try {
    const { materialId } = req.body;

    if (!materialId) {
      return res.status(400).json({
        success: false,
        message: 'materialId is required in request body',
      });
    }

    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    // Ownership check
    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this study material',
      });
    }

    // Call Gemini AI
    const flashcardsData = await geminiService.generateFlashcards(
      material.content,
      material.title,
      material.subject
    );

    // Delete existing flashcards for this material to refresh or keep clean
    await Flashcard.deleteMany({ userId: req.user._id, materialId: material._id });

    // Store generated flashcards
    const createdFlashcards = await Flashcard.insertMany(
      flashcardsData.map((fc) => ({
        userId: req.user._id,
        materialId: material._id,
        question: fc.question,
        answer: fc.answer,
      }))
    );

    return res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully',
      count: createdFlashcards.length,
      data: createdFlashcards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Multiple Choice Quiz
// @route   POST /api/ai/quiz
// @access  Private
const generateMaterialQuiz = async (req, res, next) => {
  try {
    const { materialId } = req.body;

    if (!materialId) {
      return res.status(400).json({
        success: false,
        message: 'materialId is required in request body',
      });
    }

    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    // Ownership check
    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this study material',
      });
    }

    // Call Gemini AI
    const quizQuestions = await geminiService.generateQuiz(
      material.content,
      material.title,
      material.subject
    );

    // Remove existing quiz for this material if present
    await Quiz.deleteMany({ userId: req.user._id, materialId: material._id });

    const quizObj = await Quiz.create({
      userId: req.user._id,
      materialId: material._id,
      questions: quizQuestions,
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz generated successfully',
      data: quizObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate personalized AI study plan
// @route   POST /api/ai/study-plan
// @access  Private
const generatePersonalizedStudyPlan = async (req, res, next) => {
  try {
    const { subject, examDate, availableTime, learningGoal, materialId } = req.body;

    if (!subject || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'Subject and examDate are required fields',
      });
    }

    let materialContent = '';
    let matId = null;

    if (materialId) {
      const material = await StudyMaterial.findById(materialId);
      if (material && (material.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
        materialContent = material.content;
        matId = material._id;
      }
    }

    const planData = await geminiService.generateStudyPlan(
      subject,
      examDate,
      availableTime || '2 hours daily',
      learningGoal || 'Comprehensive revision',
      materialContent
    );

    const studyPlanRecord = await StudyPlan.create({
      userId: req.user._id,
      materialId: matId,
      subject,
      examDate,
      availableTime: availableTime || '2 hours daily',
      learningGoal: learningGoal || 'Comprehensive revision',
      studyPlan: planData,
    });

    return res.status(201).json({
      success: true,
      message: 'Study plan generated successfully',
      data: studyPlanRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user summaries
// @route   GET /api/ai/summaries
// @access  Private
const getSummaries = async (req, res, next) => {
  try {
    const summaries = await Summary.find({ userId: req.user._id })
      .populate('materialId', 'title subject')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user flashcards
// @route   GET /api/ai/flashcards
// @access  Private
const getFlashcards = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.materialId) {
      query.materialId = req.query.materialId;
    }
    const flashcards = await Flashcard.find(query)
      .populate('materialId', 'title subject')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user quizzes
// @route   GET /api/ai/quizzes
// @access  Private
const getQuizzes = async (req, res, next) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.materialId) {
      query.materialId = req.query.materialId;
    }
    const quizzes = await Quiz.find(query)
      .populate('materialId', 'title subject')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user study plans
// @route   GET /api/ai/study-plans
// @access  Private
const getStudyPlans = async (req, res, next) => {
  try {
    const studyPlans = await StudyPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: studyPlans.length,
      data: studyPlans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resources for a specific material ID
// @route   GET /api/ai/material/:materialId/resources
// @access  Private
const getMaterialResources = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const material = await StudyMaterial.findById(materialId);

    if (!material) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const [summary, flashcards, quiz] = await Promise.all([
      Summary.findOne({ materialId }),
      Flashcard.find({ materialId }),
      Quiz.findOne({ materialId }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary,
        flashcards,
        quiz,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateMaterialSummary,
  generateMaterialFlashcards,
  generateMaterialQuiz,
  generatePersonalizedStudyPlan,
  getSummaries,
  getFlashcards,
  getQuizzes,
  getStudyPlans,
  getMaterialResources,
};
