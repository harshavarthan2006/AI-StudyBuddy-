const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env and root .env if present
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await connectDB();

    console.log('Seeding demo accounts...');

    // Demo Admin
    const adminEmail = 'admin@example.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✓ Admin account created: admin@example.com / Admin@123');
    } else {
      console.log('• Admin account already exists');
    }

    // Demo Student
    const studentEmail = 'rahul@example.com';
    let studentUser = await User.findOne({ email: studentEmail });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Rahul',
        email: studentEmail,
        password: 'Student@123',
        role: 'student',
      });
      console.log('✓ Student account created: rahul@example.com / Student@123');
    } else {
      console.log('• Student account already exists');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
