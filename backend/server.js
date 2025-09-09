// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// --- Security & parsing ---
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// --- CORS ---
const allowed = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://crypto-dash-one-theta.vercel.app'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: false // עובדים עם Bearer token, לא cookies
}));

// --- Mongo ---
(async () => {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000
  });
  console.log('Mongo connected');
})().catch(err => {
  console.error('Mongo connect error', err);
  process.exit(1);
});

// --- Rate limit ל-/auth ---
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/auth', authLimiter);

// --- Routes ---
app.use('/auth', require('./src/routes/auth'));
app.use('/prefs', require('./src/routes/prefs'));
app.use('/vote', require('./src/routes/vote'));
app.use('/dashboard', require('./src/routes/dashboard'));

// --- Health ---
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- 404 ---
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// --- Error handler ---
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API on :${PORT}`));
