'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const Event = require('../models/event');
const Follow = require('./../models/follow');
const upload = require('./upload');

const eventsRouter = express.Router();

eventsRouter.get('/events', (req, res, next) => {
  res.render('events-create-edit/events');
});

eventsRouter.get('/events/create', (req, res, next) => {
  res.render('events-create-edit/create');
});

module.exports = eventsRouter;
