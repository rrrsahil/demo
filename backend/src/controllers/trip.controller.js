const Trip = require('../models/trip.model');
const Itinerary = require('../models/itinerary.model');
const Budget = require('../models/budget.model');
const Checklist = require('../models/checklist.model');
const Notes = require('../models/notes.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Create a new trip
// @route   POST /api/trips/create
// @access  Private
const createTrip = asyncHandler(async (req, res, next) => {
  const {
    tripName,
    description,
    startDate,
    endDate,
    destinations,
    isPublic,
    estimatedBudget,
  } = req.body;

  if (!tripName || !startDate || !endDate) {
    return res.status(400).json(new ApiResponse(400, null, 'Trip name, start date, and end date are required'));
  }
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json(new ApiResponse(400, null, 'End date must be after start date'));
  }

  const coverImage = req.file ? `/uploads/${req.file.filename}` : '';
  const parsedDestinations = typeof destinations === 'string' ? JSON.parse(destinations) : destinations || [];

  const trip = await Trip.create({
    userId: req.user._id,
    tripName,
    description,
    startDate,
    endDate,
    coverImage,
    destinations: parsedDestinations,
    estimatedBudget: estimatedBudget || 0,
    isPublic: isPublic === 'true' || isPublic === true,
  });

  res.status(201).json(new ApiResponse(201, { trip }, 'Trip created successfully'));
});

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { count: trips.length, trips }, 'Trips retrieved successfully'));
});

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  }
  if (trip.userId.toString() !== req.user._id.toString() && !trip.isPublic) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized to view this trip'));
  }
  res.status(200).json(new ApiResponse(200, { trip }, 'Trip retrieved successfully'));
});

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  }
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  const { tripName, description, startDate, endDate, destinations, isPublic, status } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : trip.coverImage;
  const parsedDestinations = typeof destinations === 'string' ? JSON.parse(destinations) : destinations;

  const updated = await Trip.findByIdAndUpdate(
    req.params.id,
    {
      tripName: tripName || trip.tripName,
      description: description !== undefined ? description : trip.description,
      startDate: startDate || trip.startDate,
      endDate: endDate || trip.endDate,
      coverImage,
      destinations: parsedDestinations || trip.destinations,
      isPublic: isPublic !== undefined ? (isPublic === 'true' || isPublic === true) : trip.isPublic,
      status: status || trip.status,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, { trip: updated }, 'Trip updated successfully'));
});

// @desc    Delete a trip (cascade)
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  }
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  // Cascade delete
  await Itinerary.deleteMany({ tripId: req.params.id });
  await Budget.deleteOne({ tripId: req.params.id });
  await Checklist.deleteMany({ tripId: req.params.id });
  await Notes.deleteMany({ tripId: req.params.id });
  await Trip.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Trip and all associated data deleted'));
});

// @desc    Get public trips (community)
// @route   GET /api/trips/public
// @access  Public
const getPublicTrips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ isPublic: true })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(20);
  res.status(200).json(new ApiResponse(200, { trips }, 'Public trips retrieved successfully'));
});

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getPublicTrips };
