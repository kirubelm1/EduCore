
const express = require('express');
const router = express.Router();

router.get('/courses', (req, res) => {
  const { teacherId } = req.query;
  console.log(`Fetching courses for teacher ${teacherId}`);
  res.status(200).json({ teacherId, courses: ['Math 101', 'Science 201'] });
});

router.post('/assign-grade', (req, res) => {
  const { teacherId, studentId, grade } = req.body;
  console.log(`Grade ${grade} assigned by teacher ${teacherId} to student ${studentId}`);
  res.status(201).json({ message: 'Grade assigned', studentId, grade });
});

module.exports = router;
