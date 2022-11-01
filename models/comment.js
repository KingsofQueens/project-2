'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 3
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  picture: {
    type: String
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
