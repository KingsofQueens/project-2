'use strict';

const express = require('express');
const eventsRouter = express.Router();
const routeGuardMiddleware = require('../middleware/route-guard');
const Event = require('../models/event');
const upload = require('./upload');

eventsRouter.get('/events', routeGuardMiddleware, (req, res, next) => {
  // /events
  // /events?category=music
  // /events?location=londo
  const { category, location } = req.query;
  Event.find({
    category: category
  })
    .then((events) => {
      // Consider renaming events-create-edit directory
      res.render('events-create-edit/events');
    })
    .catch((error) => {
      next(error);
    });
});

eventsRouter.get('/single-event/:id', (req, res, next) => {
  const { id } = req.params;
  res.render('events-create-edit/single-event');
});

// GET - '/create' - Load event creation form
eventsRouter.get('/create', routeGuardMiddleware, (req, res, next) => {
  res.render('events-create-edit/create');
});

// POST - '/create' - Handles event creation form submission
eventsRouter.post(
  '/create',
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

// GET - '/:id/edit' - Load event edition form
eventsRouter.get(
  '/:id/edit',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    Event.findById(id)
      .then((event) => {
        res.render('eventscreate-edit/edit', { event });
      })
      .catch((error) => {
        next(error);
      });
  }
);

// POST - '/:id/edit' -  Handles event edit form submission
eventsRouter.post(
  '/:id/edit',
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

// POST - '/:id/delete' - Handle event delete form submission.
eventsRouter.post('/:id/delete', routeGuardMiddleware, (req, res, next) => {
  const { id } = req.params;
  Event.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/home');
    })
    .catch((error) => next(error));
});

module.exports = eventsRouter;
