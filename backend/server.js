// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://crypto-dash-one-theta.vercel.app/login'
  ],
}));

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// ====== יצירת האפליקציה ======
const app = express();
app.use(cors({ origin: '*' }));     // לפיתוח
app.use(express.json());

// ====== רישום ראוטרים ======
const authRoutes = require('./src/routes/auth.js');
const prefsRoutes = require('./src/routes/prefs.js');
const dashboardRoutes = require('./src/routes/dashboard.js');
const voteRoutes = require('./src/routes/vote.js');

app.use('/auth', authRoutes);
app.use('/prefs', prefsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/vote', voteRoutes);

app.get('/', (_req, res) => res.json({ ok: true, service: 'cryptodash-backend' }));

const PORT = process.env.PORT || 8080;

// ====== חיבור למסד הנתונים ======
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    if (!uri) throw new Error('Missing MONGODB_URI');
    // חיבור ל-Atlas/מקומי אם ה-URI תקין
    await mongoose.connect(uri, { dbName: 'cryptodash' });
    console.log('✅ MongoDB connected');
  } catch (err) {
    // נפילה חכמה ל-DB בזיכרון לפיתוח
    console.warn('⚠️ Mongo connect failed, falling back to in-memory DB:', err?.codeName || err?.message);
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri();
    await mongoose.connect(memUri, { dbName: 'cryptodash' });
    console.log('✅ In-memory MongoDB started at', memUri);
    console.log('ℹ️ Dev mode: data resets when server restarts.');
  }
}

// ====== הפעלת השרת לאחר חיבור DB ======
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((e) => {
    console.error('Fatal DB init error:', e);
    process.exit(1);
  });

// לוגים שימושיים
mongoose.connection.on('error', (e) => console.error('Mongoose connection error:', e?.message));
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
