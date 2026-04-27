const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

dotenv.config();

const app = express();

// ── Security Middleware ──────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Logging ──────────────────────────────────────────
app.use(morgan('dev', { stream: { write: msg => logger.info(msg.trim()) } }));

// ── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate Limiting ──────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/user',     require('./routes/user'));
app.use('/api/captain',  require('./routes/captain'));
app.use('/api/rides',    require('./routes/ride'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/admin',    require('./routes/admin'));

// ── Health Check ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    service: 'Cablo AI Brain API',
    version: '2.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({ message: '🚀 Cablo AI Brain API v2 is running' });
});

// ── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler);

module.exports = app;
