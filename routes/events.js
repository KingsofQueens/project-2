'use strict';

const express = require('express');
const eventsRouter = express.Router();
const routeGuardMiddleware = require('../middleware/route-guard');
const Event = require('../models/event');
const upload = require('./upload');

eventsRouter.get('/events', routeGuardMiddleware, (req, res, next) => {
  res.render('events-create-edit/events');
});

eventsRouter.post(
  '/events/create',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { title } = req.body;
    const { description } = req.body;
    const { path } = req.file;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    const { location } = req.body;
    const { category } = req.body;
    const { price } = req.body;
    Event.create({
      title,
      description,
      host: req.user._id,
      picture,
      location,
      category,
      price
    })
      .then(() => res.redirect('/home'))
      .catch((error) => {
        next(error);
      });
  }
);

eventsRouter.get('/events/:id/edit', routeGuardMiddleware, (req, res, next) => {
  const { id } = req.params;
  Event.findById(id)
    .then((event) => {
      res.render('events-create-edit/edit', { event });
    })
    .catch((error) => {
      next(error);
    });
});

eventsRouter.post(
  '/events/:id/edit',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    const { description } = req.body;
    const { path } = req.file;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    const { location } = req.body;
    const { category } = req.body;
    const { price } = req.body;
    Event.findByIdAndUpdate(id, {
      title,
      description,
      picture,
      location,
      category,
      price
    })
      .then((event) => {
        res.redirect('/home');
      })
      .catch((error) => {
        next(error);
      });
  }
);

eventsRouter.post(
  '/events/:id/delete',
  routeGuardMiddleware,
  (req, res, next) => {
    const { id } = req.params;
    Event.findByIdAndDelete(id)
      .then(() => {
        res.redirect('/home');
      })
      .catch((error) => next(error));
  }
);

module.exports = eventsRouter;
