const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  section: { type: String, enum: ['news','prices','ai','meme'], index: true },
  itemId: { type: String, index: true },
  vote: { type: Number, enum: [-1, 1] }
}, { timestamps: true });

module.exports = mongoose.model('Vote', VoteSchema);