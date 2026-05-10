const Notes = require('../models/notes.model');
const Trip = require('../models/trip.model');

// @desc    Add note
// @route   POST /api/notes/add
// @access  Private
const addNote = async (req, res, next) => {
  try {
    const { tripId, note, title } = req.body;
    if (!tripId || !note) {
      return res.status(400).json({ success: false, message: 'Trip ID and note content are required' });
    }
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newNote = await Notes.create({ tripId, note, title: title || '' });
    res.status(201).json({ success: true, message: 'Note added', note: newNote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notes for a trip
// @route   GET /api/notes/:tripId
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Notes.find({ tripId: req.params.tripId }).sort({ createdAt: -1 });
    res.json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const noteDoc = await Notes.findById(req.params.id);
    if (!noteDoc) return res.status(404).json({ success: false, message: 'Note not found' });

    const updated = await Notes.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Note updated', note: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addNote, getNotes, updateNote, deleteNote };
