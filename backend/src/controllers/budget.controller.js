const Budget = require('../models/budget.model');
const Trip = require('../models/trip.model');

// @desc    Create or update budget for a trip
// @route   POST /api/budget/calculate
// @access  Private
const upsertBudget = async (req, res, next) => {
  try {
    const { tripId, transportCost, hotelCost, activityCost, mealCost, miscCost, currency, notes } = req.body;

    if (!tripId) {
      return res.status(400).json({ success: false, message: 'Trip ID is required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
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

    res.json({ success: true, message: 'Budget saved successfully', budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Get budget for a trip
// @route   GET /api/budget/:tripId
// @access  Private
const getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.json({ success: true, budget: null, message: 'No budget set for this trip yet' });
    }
    res.json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertBudget, getBudget };
