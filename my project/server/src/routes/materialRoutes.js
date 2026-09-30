const express = require('express');
const router = express.Router();
const {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { generateMaterialSummary } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

router.post('/upload', protect, upload.single('file'), uploadMaterial);
router.get('/', protect, getMaterials);
router.get('/:id', protect, getMaterialById);
router.put('/:id', protect, updateMaterial);
router.delete('/:id', protect, deleteMaterial);
router.post('/:id/summarize', protect, generateMaterialSummary);

module.exports = router;
