const Checklist = require('../models/checklist.model');
const Trip = require('../models/trip.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Add checklist item
// @route   POST /api/checklist/add
// @access  Private
const addItem = asyncHandler(async (req, res, next) => {
  const { tripId, item, category } = req.body;

    if (!tripId || !item) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID and item are required',
      });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const checkItem = await Checklist.create({
      tripId,
      item,
      category: category || 'Other',
    });
  res.status(201).json(new ApiResponse(201, { item: checkItem }, 'Item added'));
});

// @desc    Get all checklist items for a trip
// @route   GET /api/checklist/:tripId
// @access  Private
const getItems = asyncHandler(async (req, res, next) => {
   const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const items = await Checklist.find({
      tripId: req.params.tripId,
    }).sort({
      category: 1,
      createdAt: 1,
    });

  res.status(200).json(new ApiResponse(200, { count: items.length, items }, 'Items retrieved successfully'));
});

// @desc    Update checklist item (toggle packed / edit)
// @route   PUT /api/checklist/update/:id
// @access  Private
const updateItem = asyncHandler(async (req, res, next) => {
  const checkItem = await Checklist.findById(req.params.id);

    if (!checkItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const trip = await Trip.findById(checkItem.tripId);

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const updated = await Checklist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

  res.status(200).json(new ApiResponse(200, { item: updated }, 'Item updated'));
});

// @desc    Delete checklist item
// @route   DELETE /api/checklist/delete/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res, next) => {
  const checkItem = await Checklist.findById(req.params.id);

    if (!checkItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const trip = await Trip.findById(checkItem.tripId);

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Checklist.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Item deleted'));
});


const resetChecklist = asyncHandler(async (req, res, next) => {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Checklist.updateMany(
      { tripId: req.params.tripId },
      { packed: false }
    );

  res.status(200).json(new ApiResponse(200, null, 'Checklist reset successfully'));
});

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  resetChecklist,
};