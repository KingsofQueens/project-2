'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');

const eventsRouter = express.Router();

eventsRouter.get('/events', (req, res, next) => {
    res.render('events');
  });

module.exports = eventsRouter;