const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system activity stats & resource counts (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalMaterials,
      totalSummaries,
      totalFlashcards,
      totalQuizzes,
      totalStudyPlans,
      recentUsers,
      recentMaterials,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      StudyMaterial.countDocuments(),
      Summary.countDocuments(),
      Flashcard.countDocuments(),
      Quiz.countDocuments(),
      StudyPlan.countDocuments(),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
      StudyMaterial.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalMaterials,
        totalSummaries,
        totalFlashcards,
        totalQuizzes,
        totalStudyPlans,
        recentUsers,
        recentMaterials,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be student or admin.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all their materials (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own active account',
      });
    }

    await StudyMaterial.deleteMany({ userId: user._id });
    await Summary.deleteMany({ userId: user._id });
    await Flashcard.deleteMany({ userId: user._id });
    await Quiz.deleteMany({ userId: user._id });
    await StudyPlan.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getAdminStats,
  updateUserRole,
  deleteUser,
};
