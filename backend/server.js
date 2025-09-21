const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect(
      'Modify with your real mongodb connection string', //will be put in dotenv soon
      {
        serverSelectionTimeoutMS: 10000
      }
    );
    console.log('Connected to MongoDB');

    // User schema with role
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['Admin', 'Student', 'Teacher'], required: true }
    });

    const User = mongoose.model('User', userSchema);

    // Example users
    const admin = new User({ username: 'admin1', password: 'adminpass', role: 'Admin' });
    const student = new User({ username: 'student1', password: 'studentpass', role: 'Student' });
    const teacher = new User({ username: 'teacher1', password: 'teacherpass', role: 'Teacher' });

    await admin.save();
    await student.save();
    await teacher.save();

    console.log('Users created:', admin, student, teacher);

  } catch (err) {
    console.error('Connection or operation error:', err);
  } finally {
    mongoose.connection.close();
  }
}

main();

