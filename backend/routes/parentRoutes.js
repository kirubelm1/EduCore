const express = require('express');
const router = express.Router();

router.get('/student-progress', (req, res) => {
  const { parentId, studentId } = req.query;
  console.log(`Fetching progress for student ${studentId} by parent ${parentId}`);
  res.status(200).json({ studentId, progress: '80%', attendance: '95%' });
});

router.post('/message-teacher', (req, res) => {
  const { parentId, teacherId, message } = req.body;
  console.log(`Message from parent ${parentId} to teacher ${teacherId}: ${message}`);
  res.status(201).json({ message: 'Message sent', parentId });
});

module.exports = router;
