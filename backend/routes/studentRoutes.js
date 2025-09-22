const express = require('express');
const router = express.Router();

router.get('/grades', (req, res) => {
  const { studentId } = req.query;
  console.log(`Fetching grades for student ${studentId}`);
  res.status(200).json({ studentId, grades: { math: 'A', science: 'B' } });
});

router.post('/submit-assignment', (req, res) => {
  const { studentId, assignment } = req.body;
  console.log(`Assignment submitted by student ${studentId}: ${assignment}`);
  res.status(201).json({ message: 'Assignment submitted', studentId });
});

module.exports = router;
