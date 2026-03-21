# BookMyShow Lite++ Pro

A full-stack, production-ready MERN application for booking movie tickets. Features a clean modern UI, interactive seat selection, strict business validations, 2-minute temporary seat locking, and an admin dashboard for managing movies and shows.

## 🌟 Features

### 👤 User Features:
- **Browse Movies:** View latest movies with beautiful UI, pagination, and genre filters.
- **Movie Details:** Detailed information including synopsis, cast, runtime, and show schedules.
- **Interactive Seat Selection:** 30-seat visual grid with categorized pricing (Standard, Executive, Premium).
- **2-Minute Lock:** Seats are temporarily locked for 2 minutes to prevent simultaneous double-booking during checkout.
- **Real-Time Calculation:** Visual price calculation and seat-state updates (Available, Selected, Booked, Locked).
- **Booking History:** User dashboard showing all past and confirmed bookings.

### 🛠️ Admin Features:
- **Dashboard Overview:** Key statistics of movies, shows, and system activity.
- **Manage Movies:** Full CRUD for movies, including multi-cast form and dynamic image URLs.
- **Manage Shows:** Add shows for movies. Auto-generates 30 structured seats upon creation.

### ⚙️ Backend Logic & Scale:
- Strict Seat Validation (No double booking).
- Background Cron Job to automatically clean up expired seat locks.
- Centralized Error Handling Middleware.
- Scalable MVC Architecture.

---

## 🚀 Tech Stack

- **Frontend:** React (Hooks), Tailwind CSS, React Router, React Hot Toast, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).

---

## 📦 Setup & Installation Guide

### Prerequisites
- Node.js installed (v16+)
- MongoDB running locally or a MongoDB Atlas connection string.

### 1. Clone & Install Dependencies
First, open your terminal and install dependencies for both the `server` and `client` directories.

```bash
# Navigate to backend and install
cd server
npm install

# Navigate to frontend and install
cd ../client
npm install
```

### 2. Configure Environment Variables
Inside the `/server` directory, a `.env` file should exist:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookmyshow_lite
NODE_ENV=development
```

*(Ensure your MongoDB is running on port 27017, or update the URI accordingly.)*

### 3. Seed Sample Data (Important)
We provide a seed script to populate your database with 8 real movies and automatically generate shows across the next few days.

```bash
cd server
npm run seed
```

### 4. Start the Application

You need two terminal windows/tabs, one for the backend and one for the frontend.

**Start Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd client
npm start
```

The frontend will start on your browser at `http://localhost:3000`.

---

## 🎨 Role Navigation
This application simulates Role-Based Authentication without enforcing strict JWTs to keep the logic focused on the booking & UI flow, while being scalable.

- **To access Admin features:** Use the small "Admin Panel" toggle in the top-right corner of the navigation bar. 
- **User Role:** Clicking the "Exit Admin" button will change your role back to a general simulated user.

---

## 🔐 Booking Constraints Handled
- `400 Bad Request` if selected empty or out of range seats.
- `409 Conflict` if trying to lock/book an already booked seat.
- `409 Conflict` if trying to lock/book a seat locked by someone else.
- Lock gracefully expires exactly after `2 minutes`.
