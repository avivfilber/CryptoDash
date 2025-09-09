// backend/src/routes/dashboard.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const getPrices = require('../services/prices');
const getNews = require('../services/news');
const getAI = require('../services/ai');
const getMeme = require('../services/memes');

const router = express.Router();
router.use(auth);

const safe = async (fn, fallback) => {
  try { return await fn(); } catch { return fallback; }
};

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const prefs = user?.preferences || { assets: ['bitcoin', 'ethereum'], investorType: 'HODLer', contentTypes: ['Market News','Charts','Social','Fun'] };

    const [prices, news, ai, meme] = await Promise.all([
      safe(() => getPrices(prefs.assets), []),
      safe(() => getNews(prefs.contentTypes), []),
      safe(() => getAI(prefs.investorType), { id: 'ai-fallback', text: 'No insight available.' }),
      safe(() => getMeme(), { id: 'meme-fallback', title: 'No meme', imageUrl: '', link: '' })
    ]);

    return res.json({ prices, news, ai, meme });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
