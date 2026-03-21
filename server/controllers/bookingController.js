const Show = require('../models/Show');
const Booking = require('../models/Booking');
const { getSeatPrice } = require('./seatController');

// @desc  Book seats
// @route POST /api/book
const bookSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers, userId } = req.body;

    // --- Input Validation ---
    if (!showId || !userId) {
      return res.status(400).json({ success: false, message: 'showId and userId are required' });
    }
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'seatNumbers must be a non-empty array' });
    }

    const parsedSeats = seatNumbers.map(Number);
    const invalidSeats = parsedSeats.filter((s) => !Number.isInteger(s) || s < 1 || s > 30);
    if (invalidSeats.length > 0) {
      return res.status(400).json({ success: false, message: `Seat numbers must be between 1 and 30. Invalid: ${invalidSeats.join(', ')}` });
    }

    const show = await Show.findById(showId).populate('movie');
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    const now = new Date();

    // Validate every seat
    for (const seatNum of parsedSeats) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} does not exist` });
      }
      if (seat.isBooked) {
        return res.status(409).json({ success: false, message: `Seat ${seatNum} is already booked` });
      }
      // Check if locked by another user (active lock)
      if (seat.lockedBy && seat.lockedBy !== userId && seat.lockExpiry && seat.lockExpiry > now) {
        return res.status(409).json({ success: false, message: `Seat ${seatNum} is locked by another user` });
      }
      // Check if lock was held by this user but has expired
      if (seat.lockedBy === userId && seat.lockExpiry && seat.lockExpiry <= now) {
        return res.status(409).json({ success: false, message: `Lock for seat ${seatNum} has expired. Please lock again.` });
      }
    }

    // Build seat details with pricing
    const seatDetails = parsedSeats.map((seatNum) => ({
      seatNumber: seatNum,
      price: getSeatPrice(seatNum),
    }));

    // Calculate total (backend only)
    const totalAmount = seatDetails.reduce((sum, s) => sum + s.price, 0);

    // Mark seats as booked and clear locks
    show.seats.forEach((seat) => {
      if (parsedSeats.includes(seat.seatNumber)) {
        seat.isBooked = true;
        seat.lockedBy = null;
        seat.lockExpiry = null;
      }
    });

    await show.save();

    // Create booking record
    const booking = await Booking.create({
      userId,
      show: showId,
      movie: show.movie._id,
      seats: seatDetails,
      totalAmount,
    });

    await booking.populate([
      { path: 'show', select: 'showTime screen' },
      { path: 'movie', select: 'title posterUrl genre duration' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get booking history for a user
// @route GET /api/bookings/:userId
const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const bookings = await Booking.find({ userId })
      .populate('movie', 'title posterUrl genre duration language')
      .populate('show', 'showTime screen')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

module.exports = { bookSeats, getUserBookings };
