const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      unique: true,
    },
    transportCost: { type: Number, default: 0, min: 0 },
    hotelCost: { type: Number, default: 0, min: 0 },
    activityCost: { type: Number, default: 0, min: 0 },
    mealCost: { type: Number, default: 0, min: 0 },
    miscCost: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual: total cost
budgetSchema.virtual('totalCost').get(function () {
  return (
    this.transportCost +
    this.hotelCost +
    this.activityCost +
    this.mealCost +
    this.miscCost
  );
});

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);
