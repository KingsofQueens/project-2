'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: {
    type: String
  },
  message: {
    type: String,
    minlength: 3
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
