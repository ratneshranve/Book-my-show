const express = require('express');
const router = express.Router();
const { bookSeats, getUserBookings } = require('../controllers/bookingController');

// POST /api/book
router.post('/', bookSeats);

// GET /api/bookings/:userId
router.get('/:userId', getUserBookings);

module.exports = router;
