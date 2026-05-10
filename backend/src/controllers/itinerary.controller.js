const Itinerary = require('../models/itinerary.model');
const Trip = require('../models/trip.model');

// @desc    Add itinerary day for a trip
// @route   POST /api/itinerary/add
// @access  Private
const addItinerary = async (req, res, next) => {
  try {
    const { tripId, day, city, date, activities, notes } = req.body;
    if (!tripId || !day || !city) {
      return res.status(400).json({ success: false, message: 'Trip ID, day number, and city are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const existing = await Itinerary.findOne({ tripId, day });
    if (existing) {
      return res.status(400).json({ success: false, message: `Day ${day} already exists for this trip` });
    }

    const itinerary = await Itinerary.create({ tripId, day, city, date, activities: activities || [], notes });
    res.status(201).json({ success: true, message: 'Day added to itinerary', itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all itinerary days for a trip
// @route   GET /api/itinerary/:tripId
// @access  Private
const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.find({ tripId: req.params.tripId }).sort({ day: 1 });
    res.json({ success: true, itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    Update itinerary day
// @route   PUT /api/itinerary/:id
// @access  Private
const updateItinerary = async (req, res, next) => {
  try {
    const item = await Itinerary.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Itinerary day not found' });

    const trip = await Trip.findById(item.tripId);
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Itinerary updated', itinerary: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete itinerary day
// @route   DELETE /api/itinerary/:id
// @access  Private
const deleteItinerary = async (req, res, next) => {
  try {
    const item = await Itinerary.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Itinerary day not found' });

    const trip = await Trip.findById(item.tripId);
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Day removed from itinerary' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addItinerary, getItinerary, updateItinerary, deleteItinerary };
