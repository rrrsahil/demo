const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    popularActivities: [String],
    avgDailyCost: {
      type: Number,
      default: 2000,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
