const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    activityName: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Adventure', 'Culture', 'Food', 'Nature', 'Shopping', 'Nightlife', 'Relaxation', 'Sports', 'General'],
      default: 'General',
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: String,
      default: '1-2 hours',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
