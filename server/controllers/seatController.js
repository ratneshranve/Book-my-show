const Show = require('../models/Show');

/**
 * Calculate price for a seat number
 * Seats 1–10  → ₹150
 * Seats 11–20 → ₹180
 * Seats 21–30 → ₹200
 */
const getSeatPrice = (seatNumber) => {
  if (seatNumber >= 1 && seatNumber <= 10) return 150;
  if (seatNumber >= 11 && seatNumber <= 20) return 180;
  if (seatNumber >= 21 && seatNumber <= 30) return 200;
  return 0;
};

// @desc  Lock seats for 2 minutes
// @route POST /api/seats/lock
const lockSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers, userId } = req.body;

    // --- Input Validation ---
    if (!showId || !userId) {
      return res.status(400).json({ success: false, message: 'showId and userId are required' });
    }
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'seatNumbers must be a non-empty array' });
    }

    // Validate seat range
    const parsedSeats = seatNumbers.map(Number);
    const invalidSeats = parsedSeats.filter((s) => !Number.isInteger(s) || s < 1 || s > 30);
    if (invalidSeats.length > 0) {
      return res.status(400).json({ success: false, message: `Seat numbers must be between 1 and 30. Invalid: ${invalidSeats.join(', ')}` });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    const now = new Date();
    const lockExpiry = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes

    // Check each seat
    for (const seatNum of parsedSeats) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} does not exist` });
      }
      if (seat.isBooked) {
        return res.status(409).json({ success: false, message: `Seat ${seatNum} is already booked` });
      }
      // Locked by another user (lock not expired)
      if (seat.lockedBy && seat.lockedBy !== userId && seat.lockExpiry && seat.lockExpiry > now) {
        return res.status(409).json({ success: false, message: `Seat ${seatNum} is locked by another user` });
      }
    }

    // Lock the seats
    show.seats.forEach((seat) => {
      if (parsedSeats.includes(seat.seatNumber)) {
        seat.lockedBy = userId;
        seat.lockExpiry = lockExpiry;
      }
    });

    await show.save();

    res.json({
      success: true,
      message: 'Seats locked for 2 minutes',
      data: {
        lockedSeats: seatNumbers,
        lockExpiry,
        expiresAt: lockExpiry.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Unlock seats (manual release)
// @route POST /api/seats/unlock
const unlockSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers, userId } = req.body;

    if (!showId || !userId || !seatNumbers) {
      return res.status(400).json({ success: false, message: 'showId, userId, seatNumbers required' });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    show.seats.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber) && seat.lockedBy === userId) {
        seat.lockedBy = null;
        seat.lockExpiry = null;
      }
    });

    await show.save();
    res.json({ success: true, message: 'Seats unlocked' });
  } catch (err) {
    next(err);
  }
};

module.exports = { lockSeats, unlockSeats, getSeatPrice };
