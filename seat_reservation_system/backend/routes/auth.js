const express = require('express');
const jwt = require('jsonwebtoken');
const Intern = require('../models/Intern');
const router = express.Router();

// Register new intern
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Intern.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new intern
    const intern = new Intern({
      username,
      email,
      password
    });

    await intern.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: intern._id, username: intern.username, role: 'intern' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: intern._id,
        username: intern.username,
        email: intern.email,
        role: 'intern'
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login intern only
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await intern.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: intern._id, username: intern.username, role: 'intern' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: intern._id,
        username: intern.username,
        email: intern.email,
        role: 'intern'
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 