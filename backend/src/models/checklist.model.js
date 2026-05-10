const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    item: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    packed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Medications', 'Accessories', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Checklist', checklistSchema);
