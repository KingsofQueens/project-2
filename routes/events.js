'use strict';

const express = require('express');
const eventsRouter = express.Router();
const routeGuardMiddleware = require('../middleware/route-guard');
const Event = require('../models/event');
const upload = require('./upload');

eventsRouter.get('/events', routeGuardMiddleware, (req, res, next) => {
  // Consider renaming events-create-edit directory
  res.render('events-create-edit/events');
});

// Missing get handler for single event
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

// Missing post handler for edit

// GET - '/create' - Load event creation form
eventsRouter.get('/events/create', routeGuardMiddleware, (req, res, next) => {
  res.render('events-create-edit/create');
});

// POST - '/create' - Handles event creation form submission
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

// GET - '/:id/edit' - Load event edition form
// Seems to be duplicated
eventsRouter.get('/:id/edit', routeGuardMiddleware, (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then((event) => {
      res.render('events-create-edit/edit', { event: event });
    })
    .catch((error) => {
      next(error);
    });
});

// POST - '/:id/edit' - Handle event edit form submission.
eventsRouter.post(
  '/:id/edit',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const id = req.params.id;
    const message = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    // to prevent users from editing events for which they are not the host
    Event.findByIdAndUpdate(id, {
      message,
      picture
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  }
);

// POST - '/:id/delete' - Handle event delete form submission.
eventsRouter.post('/:id/delete', routeGuardMiddleware, (req, res, next) => {
  const id = req.params.id;
  //prevent users from deleting events for which they are not the host
  Event.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

// Tripled
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
