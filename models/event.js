'use strict';

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
   
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    picture: {
      type: String
    },
    location: {
      type: String
    },
    category: {
      type: String,
      enum: ['music', 'sports']
    },
    price: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/* ventSchema.methods.getAddedInformation = function (userId) {
  const event = this;
  const hasBeenUpdated =
    String(event.createdAt) !== String(event.updatedAt);
  const isOwn = userId
    ? String(userId) === String(event.author._id)
    : false;
  return {
    ...publication.toJSON(),
    hasBeenUpdated,
    isOwn
  };
}; */

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
