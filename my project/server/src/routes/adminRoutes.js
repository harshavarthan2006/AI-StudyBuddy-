const express = require('express');
const router = express.Router();
const {
  getUsers,
  getAdminStats,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getAdminStats);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
