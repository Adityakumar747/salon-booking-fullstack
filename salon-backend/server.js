require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const { generalLimiter } = require('./src/middleware/rateLimiter');
const authRoutes = require('./src/routes/api/v1/auth');
const serviceRoutes = require('./src/routes/api/v1/services');
const appointmentRoutes = require('./src/routes/api/v1/appointments');
const slotRoutes = require('./src/routes/api/v1/slots');
const galleryRoutes = require('./src/routes/api/v1/gallery');
const analyticsRoutes = require('./src/routes/api/v1/analytics');
const settingsRoutes = require('./src/routes/api/v1/settings');
const stylistRoutes = require('./src/routes/api/v1/stylists');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3000'
    ],
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/stylists', stylistRoutes);

// Global error handler
app.use(errorHandler);

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = app;
