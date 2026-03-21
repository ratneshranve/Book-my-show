const express = require('express');
const router = express.Router();
const { getShowsByMovie, getShowById } = require('../controllers/showController');

router.get('/:movieId', getShowsByMovie);
router.get('/detail/:showId', getShowById);

module.exports = router;
