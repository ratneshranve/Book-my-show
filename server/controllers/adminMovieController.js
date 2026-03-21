const Movie = require('../models/Movie');

// @desc  Create a new movie
// @route POST /api/admin/movies
const createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, duration, language, releaseDate, posterUrl, bannerUrl, cast, director, rating } = req.body;

    // Validation
    if (!title || !description || !duration || !language || !releaseDate) {
      return res.status(400).json({ success: false, message: 'title, description, duration, language, releaseDate are required' });
    }
    if (!genre || !Array.isArray(genre) || genre.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one genre is required (array)' });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      duration: Number(duration),
      language,
      releaseDate: new Date(releaseDate),
      posterUrl: posterUrl || '',
      bannerUrl: bannerUrl || '',
      cast: cast || [],
      director: director || '',
      rating: rating || 0,
    });

    res.status(201).json({ success: true, message: 'Movie created successfully', data: movie });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all movies (admin)
// @route GET /api/admin/movies
const getAllMoviesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: movies,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Update a movie
// @route PUT /api/admin/movies/:id
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, message: 'Movie updated', data: movie });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a movie
// @route DELETE /api/admin/movies/:id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createMovie, getAllMoviesAdmin, updateMovie, deleteMovie };
