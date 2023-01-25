'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const upload = require('./upload');
const User = require('./../models/user');

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', upload.single('profilePicture'), (req, res, next) => {
  const { username, email, password, location } = req.body;
  let profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  }
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        username,
        email,
        passwordHashAndSalt: hash,
        location,
        profilePicture
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect(`/user/profile/${user._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect(`/user/profile/${user._id}`);
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
