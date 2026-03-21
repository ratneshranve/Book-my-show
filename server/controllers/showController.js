const Show = require('../models/Show');

// @desc  Get shows for a movie
// @route GET /api/shows/:movieId
const getShowsByMovie = async (req, res, next) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId, isActive: true })
      .populate('movie', 'title duration genre posterUrl language')
      .sort({ showTime: 1 });

    if (!shows || shows.length === 0) {
      return res.status(404).json({ success: false, message: 'No shows found for this movie' });
    }

    res.json({ success: true, data: shows });
  } catch (err) {
    next(err);
  }
};

// @desc  Get a single show by ID (with seat status)
// @route GET /api/shows/detail/:showId
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId).populate('movie', 'title duration genre posterUrl language');
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    // Clean up expired locks before returning
    const now = new Date();
    let modified = false;
    show.seats.forEach((seat) => {
      if (!seat.isBooked && seat.lockedBy && seat.lockExpiry && seat.lockExpiry <= now) {
        seat.lockedBy = null;
        seat.lockExpiry = null;
        modified = true;
      }
    });
    if (modified) await show.save();

    res.json({ success: true, data: show });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShowsByMovie, getShowById };
