const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');
const User = require('./src/models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LearnMate API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/materials', materialRoutes); // Alias for plural endpoint requirement
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Auto-seed demo accounts on server startup
const seedDemoAccounts = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✓ Auto-seeded Admin account: admin@example.com / Admin@123');
    }
    const studentExists = await User.findOne({ email: 'rahul@example.com' });
    if (!studentExists) {
      await User.create({
        name: 'Rahul',
        email: 'rahul@example.com',
        password: 'Student@123',
        role: 'student',
      });
      console.log('✓ Auto-seeded Student account: rahul@example.com / Student@123');
    }
  } catch (err) {
    console.warn('Auto-seed check failed:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`LearnMate Backend Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`=================================`);
  seedDemoAccounts();
});
