const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  internId: {
    type: String,
    required: true
  },
  internName: {
    type: String,
    required: true
  },
  seatNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index to prevent double booking
reservationSchema.index({ seatNumber: 1, date: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema); 