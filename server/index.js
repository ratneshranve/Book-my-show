const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const adminMovieRoutes = require('./routes/adminMovieRoutes');
const adminShowRoutes = require('./routes/adminShowRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const seatRoutes = require('./routes/seatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { cleanExpiredLocks } = require('./utils/lockCleaner');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Background job: clean expired locks every 2 minutes
cron.schedule('*/2 * * * *', async () => {
  try {
    const count = await cleanExpiredLocks();
    if (count > 0) console.log(`🔓 Cleaned ${count} expired seat locks`);
  } catch (err) {
    console.error('Lock cleaner error:', err.message);
  }
});

// Routes
app.use('/api/admin/movies', adminMovieRoutes);
app.use('/api/admin/shows', adminShowRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
