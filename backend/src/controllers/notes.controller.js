const Notes = require('../models/notes.model');
const Trip = require('../models/trip.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Add note
// @route   POST /api/notes/add
// @access  Private
const addNote = asyncHandler(async (req, res, next) => {
  const { tripId, note, title, dayLabel } = req.body;
    if (!tripId || !note) {
      return res.status(400).json({ success: false, message: 'Trip ID and note content are required' });
    }
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

const newNote = await Notes.create({
  tripId,
  note,
  title: title || '',
  dayLabel: dayLabel || '',
});
  res.status(201).json(new ApiResponse(201, { note: newNote }, 'Note added'));
});

// @desc    Get all notes for a trip
// @route   GET /api/notes/:tripId
// @access  Private
const getNotes = asyncHandler(async (req, res, next) => {
  const notes = await Notes.find({ tripId: req.params.tripId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { count: notes.length, notes }, 'Notes retrieved successfully'));
});

// @desc    Edit note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res, next) => {
  const noteDoc = await Notes.findById(req.params.id);

    if (!noteDoc) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    const trip = await Trip.findById(noteDoc.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Associated trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note',
      });
    }

    const updated = await Notes.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        note: req.body.note,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  res.status(200).json(new ApiResponse(200, { note: updated }, 'Note updated'));
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res, next) => {
  const noteDoc = await Notes.findById(req.params.id);

    if (!noteDoc) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    const trip = await Trip.findById(noteDoc.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Associated trip not found',
      });
    }

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    await Notes.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Note deleted'));
});

module.exports = { addNote, getNotes, updateNote, deleteNote };
