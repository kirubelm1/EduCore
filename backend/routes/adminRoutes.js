const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  const { role } = req.query;
  console.log(`Fetching users with role ${role}`);
  res.status(200).json([{ id: '1', name: 'Admin User', role: 'admin' }]);
});

router.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`Deleting user ${userId}`);
  res.status(200).json({ message: 'User deleted', userId });
});

module.exports = router;
