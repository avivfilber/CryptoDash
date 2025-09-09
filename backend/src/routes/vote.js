// backend/src/routes/vote.js
const express = require('express');
const auth = require('../middleware/auth');
const Vote = require('../models/Vote');

const router = express.Router();
router.use(auth);

const SECTIONS = new Set(['news', 'prices', 'ai', 'meme']);

router.post('/', async (req, res, next) => {
  try {
    const { section, itemId, vote } = req.body || {};
    if (!SECTIONS.has(section) || typeof itemId !== 'string' || ![1, -1].includes(vote)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    await Vote.findOneAndUpdate(
      { userId: req.user.id, section, itemId },
      { $set: { vote } },
      { upsert: true, new: true }
    );
    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
