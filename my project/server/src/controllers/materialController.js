const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const { extractTextFromFile } = require('../utils/upload');

// @desc    Upload or create new study material
// @route   POST /api/material/upload
// @access  Private (Student/Admin)
const uploadMaterial = async (req, res, next) => {
  try {
    const { title, subject } = req.body;
    let content = req.body.content || '';

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Title and subject are required fields',
      });
    }

    let fileName = null;
    let filePath = null;

    if (req.file) {
      fileName = req.file.originalname;
      filePath = req.file.path;
      const extracted = await extractTextFromFile(req.file.path, req.file.mimetype);
      if (extracted) {
        content = content ? `${content}\n\n--- Attached File Content (${fileName}) ---\n${extracted}` : extracted;
      }
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Study material text content or readable uploaded file is required',
      });
    }

    const material = await StudyMaterial.create({
      userId: req.user._id,
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim(),
      fileName,
      filePath,
    });

    return res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all study materials for authenticated user
// @route   GET /api/material
// @access  Private
const getMaterials = async (req, res, next) => {
  try {
    const materials = await StudyMaterial.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single study material by ID
// @route   GET /api/material/:id
// @access  Private
const getMaterialById = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    // Ownership check (or Admin access)
    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this study material',
      });
    }

    return res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update study material
// @route   PUT /api/material/:id
// @access  Private
const updateMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

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
        message: 'Forbidden: You cannot modify this study material',
      });
    }

    const { title, subject, content } = req.body;
    if (title) material.title = title.trim();
    if (subject) material.subject = subject.trim();
    if (content) material.content = content.trim();

    const updatedMaterial = await material.save();

    return res.status(200).json({
      success: true,
      message: 'Study material updated successfully',
      data: updatedMaterial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study material
// @route   DELETE /api/material/:id
// @access  Private
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    // Ownership check (or Admin access)
    if (material.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete this study material',
      });
    }

    // Clean up associated resources
    await Summary.deleteMany({ materialId: material._id });
    await Flashcard.deleteMany({ materialId: material._id });
    await Quiz.deleteMany({ materialId: material._id });
    await StudyMaterial.findByIdAndDelete(material._id);

    return res.status(200).json({
      success: true,
      message: 'Study material and associated AI resources deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
