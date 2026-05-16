const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Get all reservations for an intern
router.get('/intern/:internId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      internId: req.params.internId 
    }).sort({ date: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reservation
router.post('/', async (req, res) => {
  try {
    const { internId, internName, seatNumber, date } = req.body;
    
    // Check if seat is already booked for this date
    const existingReservation = await Reservation.findOne({
      seatNumber,
      date: new Date(date),
      status: 'active'
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Seat is already booked for this date' });
    }

    const reservation = new Reservation({
      internId,
      internName,
      seatNumber,
      date: new Date(date)
    });

    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update reservation
router.patch('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    Object.assign(reservation, req.body);
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel reservation
router.patch('/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = 'cancelled';
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.remove();
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 