const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Get available seats for a specific date
router.get('/available/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const totalSeats = 50; // Adjust if you have a different total

    // Find all active reservations for the date
    const reservations = await Reservation.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: 'active'
    });

    // Get booked seat numbers
    const bookedSeats = reservations.map(r => r.seatNumber);

    // Generate available seats
    const availableSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
      if (!bookedSeats.includes(i)) {
        availableSeats.push(i);
      }
    }

    res.json({
      date: req.params.date,
      totalSeats,
      bookedSeats,
      availableSeats,
      availableCount: availableSeats.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all seats status for a date
router.get('/status/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const totalSeats = 50;

    // Find all reservations for the date
    const reservations = await Reservation.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    // Create seat status array
    const seatStatus = [];
    for (let i = 1; i <= totalSeats; i++) {
      const reservation = reservations.find(r => r.seatNumber === i && r.status === 'active');
      seatStatus.push({
        seatNumber: i,
        isBooked: !!reservation,
        bookedBy: reservation ? reservation.internName : null,
        status: reservation ? 'booked' : 'available'
      });
    }

    res.json({
      date: req.params.date,
      seatStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;