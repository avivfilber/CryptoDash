// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function isEmail(x) {
  return typeof x === 'string' && /\S+@\S+\.\S+/.test(x);
}

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !isEmail(email) || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash, preferences: {} });
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!isEmail(email) || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: String(user._id), name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
