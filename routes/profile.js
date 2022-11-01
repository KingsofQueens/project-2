'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const Event = require('../models/event');
const Follow = require('./../models/follow');
const upload = require('./upload');

const profileRouter = express.Router();

profileRouter.get('/profile/:userId/events', (req, res, next) => {
  const { userId } = req.params;
  Event.find(() => {
    host: userId;
  })
    .then((events) => {
      //send the events to a view
    })
    .catch((error) => {
      next(error);
    });
});

// - User profile => GET - 'user/profile' => Render 1/ user information, 2/ Allow user to edit or delete profile, 3/ a form for event creation, 4/ populate all the event created by this user
// - User profile => POST - 'user/profile' => Handles edit/delete of user profile
// - User profile => POST - 'user/profile' => Handles event creation form submission

profileRouter.get('/profile/:id', (req, res, next) => {
  const { id } = req.params;
  let user, events;
  User.findById(id)
    .then((userDocument) => {
      user = userDocument;
      console.log(user);
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
      res.render('profile/profile', {
        profile: user,
        follow,
        isOwnProfile
      });
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.get(
  '/profile/:id/edit',
  routeGuardMiddleware,
  (req, res, next) => {
    res.render('profile/edit', { profile: req.user });
  }
);

// Handles edit of user profile
profileRouter.post(
  '/profile/:id/edit',
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
        res.redirect(`/user/profile/${req.user._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

// Handles delete of user profile
profileRouter.post('/profile/:id', routeGuardMiddleware, (req, res, next) => {
  User.findByIdAndDelete(req.user._id)
    .then(() => {
      res.redirect('/home');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = profileRouter;
