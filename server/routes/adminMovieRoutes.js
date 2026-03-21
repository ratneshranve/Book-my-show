const express = require('express');
const router = express.Router();
const { createMovie, getAllMoviesAdmin, updateMovie, deleteMovie } = require('../controllers/adminMovieController');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.post('/', isAdmin, createMovie);
router.get('/', isAdmin, getAllMoviesAdmin);
router.put('/:id', isAdmin, updateMovie);
router.delete('/:id', isAdmin, deleteMovie);

module.exports = router;
