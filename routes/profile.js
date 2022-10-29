'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const Event = require('../models/event');
const upload = require('./../upload');

const profileRouter = express.Router();

// - User profile => GET - 'user/profile' => Render 1/ user information, 2/ Allow user to edit or delete profile, 3/ a form for event creation, 4/ populate all the event created by this user
// - User profile => POST - 'user/profile' => Handles edit/delete of user profile
// - User profile => POST - 'user/profile' => Handles event creation form submission

profileRouter.get('/profile', (req, res, next) => {
    
  const { id } = req.user._id;
  let user, events;
  User.findById(id)
    .then((userDocument) => {
      user = userDocument;
      return Event.find({
        host: id
      }).populate('host');
    })
    .then((eventDocuments) => {
      events = eventDocuments;
      if (req.user) {
        return Follow.findOne({
          follower: req.user._id,
          followee: id
        });
      } else {
        return null;
      }
    })
    .then((follow) => {
      // We're only evaluating the expression String(req.user._id) === id
      // if we know we have an authenticated user
      const isOwnProfile = req.user ? String(req.user._id) === id : false;
      res.render('profile', {
        profile: user,
        follow,
        isOwnProfile
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Handles edit of user profile
profileRouter.post(
  '/profile',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { username, email, location } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    User.findByIdAndUpdate(req.user._id, { username, email, location, picture })
      .then(() => {
        res.redirect('/profile');
      })
      .catch((error) => {
        next(error);
      });
  }
);

// Handles delete of user profile
profileRouter.post('/profile', routeGuardMiddleware, (req, res, next) => {
  User.findByIdAndDelete(req.user._id)
    .then(() => {
      res.redirect('/home');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = profileRouter;
