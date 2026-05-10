const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getPublicTrips } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../configs/multer');

router.get('/public', getPublicTrips);
router.post('/create', protect, upload.single('coverImage'), createTrip);
router.get('/', protect, getTrips);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, upload.single('coverImage'), updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
