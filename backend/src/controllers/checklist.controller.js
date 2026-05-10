const Checklist = require('../models/checklist.model');
const Trip = require('../models/trip.model');

// @desc    Add checklist item
// @route   POST /api/checklist/add
// @access  Private
const addItem = async (req, res, next) => {
  try {
    const { tripId, item, category } = req.body;
    if (!tripId || !item) {
      return res.status(400).json({ success: false, message: 'Trip ID and item are required' });
    }
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const checkItem = await Checklist.create({ tripId, item, category: category || 'Other' });
    res.status(201).json({ success: true, message: 'Item added', item: checkItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all checklist items for a trip
// @route   GET /api/checklist/:tripId
// @access  Private
const getItems = async (req, res, next) => {
  try {
    const items = await Checklist.find({ tripId: req.params.tripId }).sort({ category: 1, createdAt: 1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// @desc    Update checklist item (toggle packed / edit)
// @route   PUT /api/checklist/update/:id
// @access  Private
const updateItem = async (req, res, next) => {
  try {
    const checkItem = await Checklist.findById(req.params.id);
    if (!checkItem) return res.status(404).json({ success: false, message: 'Item not found' });

    const updated = await Checklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Item updated', item: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete checklist item
// @route   DELETE /api/checklist/delete/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    await Checklist.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addItem, getItems, updateItem, deleteItem };
