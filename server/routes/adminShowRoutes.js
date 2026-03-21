const express = require('express');
const router = express.Router();
const { createShow, getAllShowsAdmin, deleteShow } = require('../controllers/adminShowController');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.post('/', isAdmin, createShow);
router.get('/', isAdmin, getAllShowsAdmin);
router.delete('/:id', isAdmin, deleteShow);

module.exports = router;
