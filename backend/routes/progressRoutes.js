const express = require('express');
const router = express.Router();
const {
  getProgress,
  updateProgress,
  validateFlag
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getProgress)
  .post(protect, updateProgress);

router.post('/validate-flag', protect, validateFlag);

module.exports = router;
