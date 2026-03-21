const Show = require('../models/Show');

/**
 * Cleans expired seat locks from all shows.
 * Called by background cron job every 2 minutes.
 * Returns the number of shows modified.
 */
const cleanExpiredLocks = async () => {
  const now = new Date();

  const shows = await Show.find({
    'seats.lockedBy': { $ne: null },
    'seats.lockExpiry': { $lte: now },
  });

  let totalCleaned = 0;

  for (const show of shows) {
    let modified = false;
    show.seats.forEach((seat) => {
      if (!seat.isBooked && seat.lockedBy && seat.lockExpiry && seat.lockExpiry <= now) {
        seat.lockedBy = null;
        seat.lockExpiry = null;
        modified = true;
        totalCleaned++;
      }
    });
    if (modified) await show.save();
  }

  return totalCleaned;
};

module.exports = { cleanExpiredLocks };
