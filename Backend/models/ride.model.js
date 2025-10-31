const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'captain',
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
    default: 'pending',
  },

  duration: {
    type: Number,
  }, // in seconds

  distance: {
    type: Number,
  }, // in meters

  paymentID: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },

  // OTP: optional until a captain accepts; stored as string
  otp: {
    type: String,
    select: false, // hide by default in queries (keeps it safer)
    default: null,
  },

  // OTP expiry timestamp
  otpExpiresAt: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model('ride', rideSchema);
