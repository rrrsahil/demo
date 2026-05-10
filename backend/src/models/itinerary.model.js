const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    day: {
      type: Number,
      required: [true, 'Day number is required'],
      min: 1,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    date: {
      type: Date,
    },
    activities: [
      {
        activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
        activityName: { type: String, required: true },
        category: { type: String, default: 'General' },
        cost: { type: Number, default: 0 },
        duration: { type: String, default: '1 hour' },
        time: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
