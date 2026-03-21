const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    lockedBy: {
      type: String, // userId string
      default: null,
    },
    lockExpiry: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    showTime: {
      type: Date,
      required: [true, 'Show time is required'],
    },
    screen: {
      type: String,
      default: 'Screen 1',
      trim: true,
    },
    seats: {
      type: [seatSchema],
      default: [],
    },
    totalSeats: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate 30 seats on pre-save if seats array is empty
showSchema.pre('save', function (next) {
  if (this.seats.length === 0) {
    const seats = [];
    for (let i = 1; i <= 30; i++) {
      seats.push({
        seatNumber: i,
        isBooked: false,
        lockedBy: null,
        lockExpiry: null,
      });
    }
    this.seats = seats;
  }
  next();
});

showSchema.virtual('availableSeats').get(function () {
  if (!this.seats || !Array.isArray(this.seats)) return 0;
  const now = new Date();
  return this.seats.filter((s) => {
    if (s.isBooked) return false;
    if (s.lockedBy && s.lockExpiry && s.lockExpiry > now) return false;
    return true;
  }).length;
});

showSchema.set('toJSON', { virtuals: true });
showSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Show', showSchema);
