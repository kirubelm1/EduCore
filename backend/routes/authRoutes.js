// routes/authRoutes.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Placeholder for authentication logic
  console.log(`Login attempt for ${email}`);
  res.status(200).json({ message: 'Login successful', user: { email, role: 'user' } });
});

router.post('/signup', (req, res) => {
  const { email, password, role } = req.body;
  // Placeholder for user creation logic
  console.log(`Signup for ${email} with role ${role}`);
  res.status(201).json({ message: 'User created', user: { email, role } });
});

module.exports = router;
