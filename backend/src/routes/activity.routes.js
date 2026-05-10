const express = require('express');
const router = express.Router();
const { getActivities, addActivity, seedActivities } = require('../controllers/activity.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, getActivities);
router.post('/add', protect, adminOnly, addActivity);
router.post('/seed', protect, adminOnly, seedActivities);

module.exports = router;
