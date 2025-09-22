const express = require('express');
const mongoose = require('mongoose');
const { auth, authorize } = require('./middleware/auth');
const { validate, userSchema } = require('./middleware/validate');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parentRoutes = require('./routes/parentRoutes');

const app = express();


app.use(express.json());

// MongoDB Connection and User Model
async function connectDB() {
  try {
    await mongoose.connect(
      'replace with real connection string',
      { serverSelectionTimeoutMS: 10000 }
    );
    console.log('Connected to MongoDB');

    // User schema with role
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true }, // Consider hashing in production
      role: { type: String, enum: ['Admin', 'Student', 'Teacher', 'Parent'], required: true },
    });

    const User = mongoose.model('User', userSchema);

    // Seed initial users 
    const seedUsers = async () => {
      const users = [
        { username: 'admin1', password: 'adminpass', role: 'Admin' },
        { username: 'student1', password: 'studentpass', role: 'Student' },
        { username: 'teacher1', password: 'teacherpass', role: 'Teacher' },
        { username: 'parent1', password: 'parentpass', role: 'Parent' },
      ];
      for (const userData of users) {
        const existingUser = await User.findOne({ username: userData.username });
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          console.log(`Created user: ${user.username}`);
        }
      }
    };
    await seedUsers();

  } catch (err) {
    console.error('MongoDB connection or seeding error:', err);
  }
}

connectDB();

// Mount routes with middleware
app.use('/api/auth', authRoutes); // Public routes (e.g., login/signup)
app.use('/api/users', auth, userRoutes); // Protected routes
app.use('/api/students', auth, authorize(['Student']), studentRoutes);
app.use('/api/teachers', auth, authorize(['Teacher']), teacherRoutes);
app.use('/api/admins', auth, authorize(['Admin']), adminRoutes);
app.use('/api/parents', auth, authorize(['Parent']), parentRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
