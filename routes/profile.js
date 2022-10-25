'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const upload = require('./../upload');

const profileRouter = express.Router();

// - User profile => GET - 'user/profile' => Render 1/ user information, 2/ Allow user to edit or delete profile, 3/ a form for event creation, 4/ populate all the event created by this user
// - User profile => POST - 'user/profile' => Handles edit/delete of user profile
// - User profile => POST - 'user/profile' => Handles event creation form submission

profileRouter.get('/profile', routeGuardMiddleware, (req, res, next) => {
  res.render('profile', { profile: req.user });
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

// Handles edelete of user profile
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
