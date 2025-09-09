// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// ===== 1) יצירת האפליקציה (חייב לפני app.use) =====
const app = express();

// ===== 2) CORS + JSON =====
const allowedOrigins = [
  'http://localhost:5173',
  'https://crypto-dash-one-theta.vercel.app', // 👈 הדומיין שלך ב-Vercel
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // אפשר גם לאפשר את כל תתי-הדומיינים של vercel:
  const isAllowed =
    !origin ||
    allowedOrigins.includes(origin) ||
    /\.vercel\.app$/.test(origin);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Vary', 'Origin'); // חשוב לפרוקסים/קאשינג
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.header('Access-Control-Allow-Credentials', 'false'); // אין צורך בקוקיז
  }

  // מענה מהיר ל-OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// (אופציונלי: לעזור ל-preflight)
app.options('*', cors());

// ===== 3) ראוטרים =====
const authRoutes = require('./src/routes/auth.js');
const prefsRoutes = require('./src/routes/prefs.js');
const dashboardRoutes = require('./src/routes/dashboard.js');
const voteRoutes = require('./src/routes/vote.js');

app.use('/auth', authRoutes);
app.use('/prefs', prefsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/vote', voteRoutes);

// בריאות
app.get('/', (_req, res) => res.json({ ok: true, service: 'cryptodash-backend' }));

// ===== 4) חיבור למסד =====
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  try {
    if (!uri) throw new Error('Missing MONGODB_URI');
    await mongoose.connect(uri, { dbName: 'cryptodash' });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️ Mongo connect failed, falling back to in-memory DB:', err?.codeName || err?.message);
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri();
    await mongoose.connect(memUri, { dbName: 'cryptodash' });
    console.log('✅ In-memory MongoDB started at', memUri);
    console.log('ℹ️ Dev mode: data resets when server restarts.');
  }
}

// ===== 5) הפעלת השרת =====
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((e) => {
    console.error('Fatal DB init error:', e);
    process.exit(1);
  });

// לוגים מועילים
mongoose.connection.on('error', (e) => console.error('Mongoose connection error:', e?.message));
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
