const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetpassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/me', protect, getMe);
router.put('/resetpassword/:resettoken', resetpassword);

module.exports = router;
