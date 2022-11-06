'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const Event = require('../models/event');
const Follow = require('./../models/follow');
const upload = require('./upload');

const profileRouter = express.Router();

// profileRouter.get('/profile/:userId/events', (req, res, next) => {
//   const { userId } = req.params;
//   console.log(userId);
//   Event.find({ host: userId })
//     .then((events) => {
//       res.render('events-create-edit/profileEvent', { events });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

profileRouter.get('/profile/:userId/events', (req, res, next) => {
  let user, events;
  const { userId } = req.params;
  Event.find({ host: userId })
    .then((eventDocuments) => {
      events = eventDocuments;
      return User.find({
        host: userId
      });
    })
    .then((userDocuments) => {
      user = userDocuments;
      res.render('events-create-edit/profileEvent', { events });
    })
    .catch((error) => {
      next(error);
    });
});

// - User profile => GET - 'user/profile' => Render 1/ user information, 2/ Allow user to edit or delete profile, 3/ a form for event creation, 4/ populate all the event created by this user
// - User profile => POST - 'user/profile' => Handles edit/delete of user profile
// - User profile => POST - 'user/profile' => Handles event creation form submission

profileRouter.get(
  '/profile/:userid/edit',
  routeGuardMiddleware,
  (req, res, next) => {
    res.render('profile/edit', { profile: req.user });
  }
);

// Handles edit of user profile
profileRouter.post(
  '/profile/:userid/edit',
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

//Follow user
profileRouter.post(
  'profile/:userid/follow',
  routeGuardMiddleware,
  (req, res, next) => {
    const { id } = req.params;
    console.log('FOLLOWER', id);
    console.log('FOLLOWEE', req.user._id);
    Follow.create({
      follower: req.user._id,
      followee: id
    })
      .then(() => {
        res.redirect(`/user/profile/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

// Unfollow User
profileRouter.post(
  'profile/:userid/unfollow',
  routeGuardMiddleware,
  (req, res, next) => {
    const { id } = req.params;
    Follow.findOneAndDelete({
      follower: req.user._id,
      followee: id
    })
      .then(() => {
        res.redirect(`/user/profile/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

profileRouter.get('/profile/:userId', (req, res, next) => {
  const { userId } = req.params;
  let user, events;
  User.findById(userId)
    .then((userDocument) => {
      user = userDocument;
      // console.log(user);
      return Event.find({
        host: userId
      }).populate('host');
    })
    .then((eventDocuments) => {
      events = eventDocuments;
      if (req.user) {
        return Follow.findOne({
          follower: req.user._id,
          followee: userId
        });
      } else {
        return null;
      }
    })
    .then((follow) => {
      // We're only evaluating the expression String(req.user._id) === userid
      // if we know we have an authenticated user
      const isOwnProfile = req.user ? String(req.user._id) === userId : false;
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

// Handles delete of user profile
profileRouter.post(
  '/profile/:userid',
  routeGuardMiddleware,
  (req, res, next) => {
    User.findByIdAndDelete(req.user._id)
      .then(() => {
        res.redirect('/home');
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = profileRouter;
