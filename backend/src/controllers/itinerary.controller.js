const Itinerary = require('../models/itinerary.model');
const Trip = require('../models/trip.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Add itinerary day for a trip
// @route   POST /api/itinerary/add
// @access  Private
const addItinerary = asyncHandler(async (req, res, next) => {
  const { tripId, day, city, date, activities, notes } = req.body;
  if (!tripId || !day || !city) {
    return res.status(400).json(new ApiResponse(400, null, 'Trip ID, day number, and city are required'));
  }

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  const existing = await Itinerary.findOne({ tripId, day });
  if (existing) {
    return res.status(400).json(new ApiResponse(400, null, `Day ${day} already exists for this trip`));
  }

  const itinerary = await Itinerary.create({ tripId, day, city, date, activities: activities || [], notes });
  res.status(201).json(new ApiResponse(201, { itinerary }, 'Day added to itinerary'));
});

// @desc    Get all itinerary days for a trip
// @route   GET /api/itinerary/:tripId
// @access  Private
const getItinerary = asyncHandler(async (req, res, next) => {
  const itinerary = await Itinerary.find({ tripId: req.params.tripId }).sort({ day: 1 });
  res.status(200).json(new ApiResponse(200, { itinerary }, 'Itinerary retrieved successfully'));
});

// @desc    Update itinerary day
// @route   PUT /api/itinerary/:id
// @access  Private
const updateItinerary = asyncHandler(async (req, res, next) => {
  const item = await Itinerary.findById(req.params.id);
  if (!item) return res.status(404).json(new ApiResponse(404, null, 'Itinerary day not found'));

  const trip = await Trip.findById(item.tripId);
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  const updated = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json(new ApiResponse(200, { itinerary: updated }, 'Itinerary updated'));
});

// @desc    Delete itinerary day
// @route   DELETE /api/itinerary/:id
// @access  Private
const deleteItinerary = asyncHandler(async (req, res, next) => {
  const item = await Itinerary.findById(req.params.id);
  if (!item) return res.status(404).json(new ApiResponse(404, null, 'Itinerary day not found'));

  const trip = await Trip.findById(item.tripId);
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  await Itinerary.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Day removed from itinerary'));
});

// @desc    Reorder itinerary days
// @route   PUT /api/itinerary/reorder/:tripId
// @access  Private
const reorderItinerary = asyncHandler(async (req, res, next) => {
  const { tripId } = req.params;
  const { orderedDays } = req.body; // Array of { id, day }

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  // Update each day's day number
  const promises = orderedDays.map(item => 
    Itinerary.findByIdAndUpdate(item.id, { day: item.day })
  );
  
  await Promise.all(promises);

  res.status(200).json(new ApiResponse(200, null, 'Itinerary reordered successfully'));
});

module.exports = { addItinerary, getItinerary, updateItinerary, deleteItinerary, reorderItinerary };
