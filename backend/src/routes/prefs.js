const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');


const router = express.Router();


router.post('/', auth, async (req,res)=>{
const { assets, investorType, contentTypes } = req.body;
const user = await User.findByIdAndUpdate(
req.userId,
{ $set: { 'preferences.assets': assets, 'preferences.investorType': investorType, 'preferences.contentTypes': contentTypes } },
{ new: true }
);
res.json({ ok: true, preferences: user.preferences });
});


module.exports = router;