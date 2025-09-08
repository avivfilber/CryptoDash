const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    preferences: {
      assets: { type: [String], default: [] },
      investorType: { type: String, default: 'HODLer' },
      contentTypes: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
