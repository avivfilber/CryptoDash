// backend/src/routes/prefs.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.use(auth);

// שמירה
router.post('/', async (req, res, next) => {
  try {
    const { assets, investorType, contentTypes } = req.body || {};
    // ולידציה בסיסית
    if (!Array.isArray(assets) || typeof investorType !== 'string' || !Array.isArray(contentTypes)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const u = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { preferences: { assets, investorType, contentTypes } } },
      { new: true }
    ).lean();
    return res.json({ ok: true, preferences: u?.preferences || null });
  } catch (e) {
    next(e);
  }
});

// קריאה
router.get('/', async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id, { preferences: 1 }).lean();
    return res.json({ preferences: u?.preferences || null });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
