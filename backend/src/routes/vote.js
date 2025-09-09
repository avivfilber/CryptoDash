const express = require('express');
const auth = require('../middleware/auth');
const Vote = require('../models/Vote');


const router = express.Router();


router.post('/', auth, async (req,res)=>{
const { section, itemId, up } = req.body;
if (!section || !itemId || typeof up !== 'boolean') return res.status(400).json({ error: 'Bad payload' });
const vote = await Vote.create({ userId: req.userId, section, itemId, vote: up ? 1 : -1 });
res.json({ ok: true, voteId: vote._id });
});


module.exports = router;