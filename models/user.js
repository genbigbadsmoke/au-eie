const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      required: true
    }
});

module.exports = mongoose.model('User', UserSchema);