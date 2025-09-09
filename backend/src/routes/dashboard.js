const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getPrices } = require('../services/prices');
const { getNews } = require('../services/news');
const { getInsight } = require('../services/ai');
const { getMeme } = require('../services/memes');


const router = express.Router();


router.get('/', auth, async (req,res)=>{
const user = await User.findById(req.userId);
const prefs = user.preferences || { assets: ['bitcoin','ethereum'], investorType: 'HODLer', contentTypes: ['Market News','Charts','Social','Fun'] };


const [ prices, news, meme ] = await Promise.all([
getPrices(prefs.assets).catch(()=>[]),
getNews().catch(()=>[]),
getMeme().catch(()=> null)
]);


const ai = await getInsight({ name: user.name || 'Investor', assets: prefs.assets, investorType: prefs.investorType });


res.json({
prices,
news,
ai: { id: 'ai-tip', text: ai },
meme
});
});


module.exports = router;