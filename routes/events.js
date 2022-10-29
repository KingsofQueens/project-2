'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');

const eventsRouter = express.Router();

eventsRouter.get('/events', (req, res, next) => {
    res.render('events');
  });

  eventsRouter.get('/events/create', (req, res, next) => {
    res.render('events/create');
  });

module.exports = eventsRouter;