const express = require('express');
const router = express.Router();
const { upsertBudget, getBudget } = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/calculate', protect, upsertBudget);
router.get('/:tripId', protect, getBudget);

module.exports = router;
