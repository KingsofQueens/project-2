'use strict';

const express = require('express');
const User = require('../models/user');
const Event = require('../models/event');
const routeGuard = require('./../middleware/route-guard');
const router = express.Router();

// - Home => GET - '/home' => Render 1/ list of highlight events (details),
// 2/ Once filter click, the event section appear will filtered (Category/Date/Location),
// 3/ participant and follower/likes (optional - attendence & follow models)

router.get('/', (req, res, next) => {
  Event.find()
    .sort({ createdAt: -1 })
    .populate('host')
    .then((events) => {
      const { title, description, location, price, host, category } = req.body;
      res.render('home', { title: 'Hello World!', events });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

// const isOwnProfile = req.user ? String(req.user._id) === id : false;
