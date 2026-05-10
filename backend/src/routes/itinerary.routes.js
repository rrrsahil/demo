const express = require('express');
const router = express.Router();
const { addItinerary, getItinerary, updateItinerary, deleteItinerary, reorderItinerary } = require('../controllers/itinerary.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/add', protect, addItinerary);
router.get('/:tripId', protect, getItinerary);
router.put('/reorder/:tripId', protect, reorderItinerary);
router.put('/:id', protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
