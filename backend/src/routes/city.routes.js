const express = require('express');
const router = express.Router();
const { getCities, seedCities } = require('../controllers/city.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getCities);
router.post('/seed', protect, seedCities);

module.exports = router;
