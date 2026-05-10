const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const activityRoutes = require('./routes/activity.routes');
const budgetRoutes = require('./routes/budget.routes');
const checklistRoutes = require('./routes/checklist.routes');
const notesRoutes = require('./routes/notes.routes');
const profileRoutes = require('./routes/profile.routes');
const { globalErrorHandler } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Traveloop API is running 🚀' });
});

app.use(globalErrorHandler);

module.exports = app;
