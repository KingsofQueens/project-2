'use strict';


const mongoose = require('mongoose');

const joinSchema = new mongoose.Schema(
  {
    joiningUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    joiningEvent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
    }
  },
  {
    timestamps: true
  }
);

const Join = mongoose.model('Join', joinSchema);

module.exports = Join;