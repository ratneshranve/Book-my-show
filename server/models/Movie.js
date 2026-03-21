const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'Genre is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one genre is required',
      },
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    posterUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    cast: [
      {
        name: { type: String, required: true, trim: true },
        role: { type: String, trim: true, default: '' },
      },
    ],
    director: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

movieSchema.virtual('formattedDuration').get(function () {
  const h = Math.floor(this.duration / 60);
  const m = this.duration % 60;
  return `${h}h ${m}m`;
});

movieSchema.set('toJSON', { virtuals: true });
movieSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Movie', movieSchema);
