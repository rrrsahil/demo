const Trip = require('../models/trip.model');
const Itinerary = require('../models/itinerary.model');
const Budget = require('../models/budget.model');
const Checklist = require('../models/checklist.model');
const Notes = require('../models/notes.model');

// @desc    Create a new trip
// @route   POST /api/trips/create
// @access  Private
const createTrip = async (req, res, next) => {
  try {
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
      return res.status(400).json({ success: false, message: 'Trip name, start date, and end date are required' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
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

    res.status(201).json({ success: true, message: 'Trip created successfully', trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.userId.toString() !== req.user._id.toString() && !trip.isPublic) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this trip' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
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

    res.json({ success: true, message: 'Trip updated successfully', trip: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip (cascade)
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Cascade delete
    await Itinerary.deleteMany({ tripId: req.params.id });
    await Budget.deleteOne({ tripId: req.params.id });
    await Checklist.deleteMany({ tripId: req.params.id });
    await Notes.deleteMany({ tripId: req.params.id });
    await Trip.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Trip and all associated data deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public trips (community)
// @route   GET /api/trips/public
// @access  Public
const getPublicTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ isPublic: true })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, trips });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getPublicTrips };
