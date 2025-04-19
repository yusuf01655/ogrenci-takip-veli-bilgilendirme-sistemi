// server/routes/authRoutes.js
const express = require('express');
const { registerUser } = require('../controllers/authController');
const { registerValidationRules, validate } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidationRules(), validate, registerUser);

// Mevcut login endpoint'iniz de burada olabilir
// router.post('/login', ...);

module.exports = router;