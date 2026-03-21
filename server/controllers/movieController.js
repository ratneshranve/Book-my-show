const Movie = require('../models/Movie');

// @desc  Get all active movies (public)
// @route GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, genre, search } = req.query;
    const query = { isActive: true };

    if (genre) query.genre = { $in: [genre] };
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      data: movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single movie by ID
// @route GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).select('-__v');
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMovies, getMovieById };
