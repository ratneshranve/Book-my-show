const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmyshow_lite';

const movies = [
  {
    title: 'Kalki 2898 AD',
    description: 'A dystopian sci-fi epic set in the year 2898 AD, blending Hindu mythology with futuristic elements in an extraordinary saga of good versus evil.',
    genre: ['Sci-Fi', 'Action', 'Drama'],
    duration: 181,
    language: 'Hindi',
    releaseDate: new Date('2024-06-27'),
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Prabhas', role: 'Kalki' },
      { name: 'Deepika Padukone', role: 'Sumati' },
      { name: 'Amitabh Bachchan', role: 'Ashwatthama' },
      { name: 'Kamal Haasan', role: 'Supreme Yaskin' },
    ],
    director: 'Nag Ashwin',
    rating: 7.8,
  },
  {
    title: 'Stree 2',
    description: 'The hugely popular horror-comedy franchise returns with Stree terrorizing Chanderi again, but this time things are different with more twists.',
    genre: ['Horror', 'Comedy'],
    duration: 145,
    language: 'Hindi',
    releaseDate: new Date('2024-08-15'),
    posterUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Rajkummar Rao', role: 'Vicky' },
      { name: 'Shraddha Kapoor', role: 'Stree' },
      { name: 'Pankaj Tripathi', role: 'Rudra' },
    ],
    director: 'Amar Kaushik',
    rating: 8.1,
  },
  {
    title: 'Fighter',
    description: 'An action thriller about Indian Air Force pilots who go on a daring mission to protect their country from a devastating terror attack.',
    genre: ['Action', 'Thriller'],
    duration: 168,
    language: 'Hindi',
    releaseDate: new Date('2024-01-25'),
    posterUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Hrithik Roshan', role: 'Shamsher Pathania' },
      { name: 'Deepika Padukone', role: 'Minal Rathore' },
      { name: 'Anil Kapoor', role: 'Rakesh Jai Singh' },
    ],
    director: 'Siddharth Anand',
    rating: 7.2,
  },
  {
    title: 'Animal',
    description: 'A raw and intense story of a son obsessed with his father, driven by unresolved rage, love, and a desperate need for validation.',
    genre: ['Action', 'Drama', 'Crime'],
    duration: 201,
    language: 'Hindi',
    releaseDate: new Date('2023-12-01'),
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Ranvijay Singh' },
      { name: 'Rashmika Mandanna', role: 'Geetanjali' },
      { name: 'Anil Kapoor', role: 'Balbir Singh' },
      { name: 'Bobby Deol', role: 'Abrar Haque' },
    ],
    director: 'Sandeep Reddy Vanga',
    rating: 7.6,
  },
  {
    title: 'Pushpa 2: The Rule',
    description: 'Pushpa Raj is back, more powerful than ever, as he expands his red sandalwood smuggling empire and faces an even more formidable adversary.',
    genre: ['Action', 'Drama', 'Crime'],
    duration: 220,
    language: 'Telugu',
    releaseDate: new Date('2024-12-05'),
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj' },
      { name: 'Rashmika Mandanna', role: 'Srivalli' },
      { name: 'Fahadh Faasil', role: 'SP Bhanwar Singh' },
    ],
    director: 'Sukumar',
    rating: 8.5,
  },
  {
    title: 'Devara: Part 1',
    description: 'A powerful two-era tale about a violent landlord and his son, set against the backdrop of a coastal village steeped in fear and legend.',
    genre: ['Action', 'Drama', 'Thriller'],
    duration: 166,
    language: 'Telugu',
    releaseDate: new Date('2024-09-27'),
    posterUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Jr. NTR', role: 'Devara / Vara' },
      { name: 'Janhvi Kapoor', role: 'Thangam' },
      { name: 'Saif Ali Khan', role: 'Bhaira' },
    ],
    director: 'Koratala Siva',
    rating: 6.9,
  },
  {
    title: 'Singham Again',
    description: 'The fearless cop Singham is back, and this time the battle of good vs. evil takes on a mythological dimension as forces collide across generations.',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 172,
    language: 'Hindi',
    releaseDate: new Date('2024-11-01'),
    posterUrl: 'https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Ajay Devgn', role: 'Bajirao Singham' },
      { name: 'Kareena Kapoor', role: 'Avni' },
      { name: 'Deepika Padukone', role: 'Shakti Shetty' },
      { name: 'Ranveer Singh', role: 'Simmba' },
    ],
    director: 'Rohit Shetty',
    rating: 6.5,
  },
  {
    title: 'The Sabarmati Report',
    description: 'Based on the 2002 Godhra train burning incident that changed the course of modern Indian history — a story of truth, media, and politics.',
    genre: ['Drama', 'Thriller', 'Biography'],
    duration: 138,
    language: 'Hindi',
    releaseDate: new Date('2024-11-15'),
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=400&fit=crop',
    cast: [
      { name: 'Vikrant Massey', role: 'Samar Kumar' },
      { name: 'Raashii Khanna', role: 'Amruta Gill' },
    ],
    director: 'Dheeraj Sarna',
    rating: 7.0,
  },
];

const generateShowTimes = (movieId) => {
  const now = new Date();
  const shows = [];
  const timeSlots = ['10:00', '13:30', '17:00', '20:30'];
  for (let day = 0; day < 5; day++) {
    for (const time of timeSlots) {
      const [h, m] = time.split(':').map(Number);
      const showDate = new Date(now);
      showDate.setDate(showDate.getDate() + day);
      showDate.setHours(h, m, 0, 0);
      shows.push({ movie: movieId, showTime: showDate, screen: `Screen ${Math.ceil(Math.random() * 3)}`, seats: [] });
    }
  }
  return shows;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    await Movie.deleteMany({});
    await Show.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const createdMovies = await Movie.insertMany(movies);
    console.log(`🎬 Inserted ${createdMovies.length} movies`);

    let showCount = 0;
    for (const movie of createdMovies) {
      const showDocs = generateShowTimes(movie._id);
      for (const showData of showDocs) {
        const show = new Show(showData);
        await show.save(); // triggers pre-save for seat generation
        showCount++;
      }
    }
    console.log(`🎭 Created ${showCount} shows (each with 30 seats)`);
    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
