const Budget = require('../models/budget.model');
const Trip = require('../models/trip.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Create or update budget for a trip
// @route   POST /api/budget/calculate
// @access  Private
const upsertBudget = asyncHandler(async (req, res, next) => {
  const { tripId, transportCost, hotelCost, activityCost, mealCost, miscCost, currency, notes } = req.body;

  if (!tripId) {
    return res.status(400).json(new ApiResponse(400, null, 'Trip ID is required'));
  }

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json(new ApiResponse(404, null, 'Trip not found'));
  if (trip.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
  }

  const budget = await Budget.findOneAndUpdate(
    { tripId },
    {
      tripId,
      transportCost: Number(transportCost) || 0,
      hotelCost: Number(hotelCost) || 0,
      activityCost: Number(activityCost) || 0,
      mealCost: Number(mealCost) || 0,
      miscCost: Number(miscCost) || 0,
      currency: currency || 'INR',
      notes: notes || '',
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, { budget }, 'Budget saved successfully'));
});

// @desc    Get budget for a trip
// @route   GET /api/budget/:tripId
// @access  Private
const getBudget = asyncHandler(async (req, res, next) => {
  const budget = await Budget.findOne({ tripId: req.params.tripId });
  if (!budget) {
    return res.status(200).json(new ApiResponse(200, { budget: null }, 'No budget set for this trip yet'));
  }
  res.status(200).json(new ApiResponse(200, { budget }, "Budget retrieved successfully"));
});

module.exports = { upsertBudget, getBudget };
