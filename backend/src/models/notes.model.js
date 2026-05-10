const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    note: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notes', notesSchema);
