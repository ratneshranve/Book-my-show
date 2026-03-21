const express = require('express');
const router = express.Router();
const { lockSeats, unlockSeats } = require('../controllers/seatController');

router.post('/lock', lockSeats);
router.post('/unlock', unlockSeats);

module.exports = router;
