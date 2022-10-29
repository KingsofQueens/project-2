'use strict';

const express = require('express');
const routeGuardMiddleware = require('../middleware/route-guard');
const User = require('../models/user');
const Event = require('../models/event');
const Follow = require('./../models/follow');
const upload = require('./upload');

const eventsRouter = express.Router();

// GET - '/events' - Load all existing events
eventsRouter.get('/events', (req, res, next) => {
  res.render('events-create-edit/events');
});

// GET - '/:id' - Load id of single event
eventsRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;

  let event;

  Event.findById(id)

    .then((comments) => {
      res.render('events-create-edit/events', {
        event: event,
        comments: comments
      });
    })
    .catch((error) => {
      next(error);
    });
});

// GET - '/create' - Load event creation form
eventsRouter.get('/events/create', routeGuardMiddleware, (req, res, next) => {
  res.render('events-create-edit/create');
});
// POST - '/create' - Handles event creation form submission
eventsRouter.post('/events/create', routeGuardMiddleware, (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;

  Event.create({
    title: title,
    body: body
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

// GET - '/:id/edit' - Load event edition form
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

module.exports = eventsRouter;
