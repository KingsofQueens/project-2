'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHashAndSalt: {
    type: String
  },
  picture: {
    type: String
  },
  location: {
    type: String
  }
});

const User = mongoose.model('User', schema);

module.exports = User;
