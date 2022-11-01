'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 3
  },
  name: {
    type: String,
    maxlength: 100
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
