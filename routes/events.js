'use strict';

const express = require('express');
const eventsRouter = express.Router();
const routeGuardMiddleware = require('../middleware/route-guard');
const Event = require('../models/event');
const User = require('../models/user');
const Follow = require('./../models/follow');
const Comment = require('./../models/comment');
const Join = require('./../models/join');
const upload = require('./upload');

eventsRouter.get('/', (req, res, next) => {
  const { category, location } = req.query;

  const query = category ? { category } : null;

  Event.find(query)
    .then((events) => {
      res.render('events-create-edit/events', { events });
    })
    .catch((error) => {
      next(error);
    });
});

// eventsRouter.get('/events', routeGuardMiddleware, (req, res, next) => {
//   // /events
//   // /events?category=music
//   // /events?location=londo
//   const { category, location } = req.query;
//   Event.find({
//     category: category
//   })
//     .then((events) => {
//       // Consider renaming events-create-edit directory
//       res.render('events-create-edit/events');
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// GET - '/create' - Load event creation form
eventsRouter.get('/create', routeGuardMiddleware, (req, res, next) => {
  res.render('events-create-edit/create');
});

//Need to pass and able to retrieve joiner info
eventsRouter.get(
  '/:id',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    let event;
    let joins;
    let comments;
    Event.findById(id)
      .populate('host')
      .then((eventDocument) => {
        event = eventDocument;
        console.log('USER', req.user._id);
        console.log('HOST', event.host._id);
        return Comment.find({ post: id }).populate('author');
      })
      .then((commentDocuments) => {
        comments = commentDocuments;
        if (req.user) {
          return Join.find({ joiningEvent: id }).populate('joiningUser');
        } else {
          return null;
        }
      })
      .then((joinDocuments) => {
        joins = joinDocuments;
        if (req.user) {
          return Join.findOne({ joiningEvent: id, joiningUser: req.user._id });
        } else {
          return null;
        }
      })
      .then((joinOfCurrentUser) => {
        console.log('JOINER', joins);
        const isOwnProfile = req.user
          ? String(req.user._id) === String(event.host._id)
          : false;
        const isJoining = joinOfCurrentUser ? true : false;
        // const isJoining = Boolean(joinOfCurrentUser);
        res.render('events-create-edit/single-event', {
          event,
          comments,
          isOwnProfile,
          isJoining,
          joins
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

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
    console.log('this is the category', category);
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
        res.render('events-create-edit/edit', { event });
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
    // const { path } = req.file;
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

//Event going user
eventsRouter.post('/:eventId/going', routeGuardMiddleware, (req, res, next) => {
  const { eventId } = req.params;
  Join.create({
    joiningUser: req.user._id,
    joiningEvent: eventId
  })
    .then(() => {
      res.redirect(`/events/${eventId}`);
    })
    .catch((error) => {
      next(error);
    });
});

// Event not going user
eventsRouter.post(
  '/:eventId/notgoing',
  routeGuardMiddleware,
  (req, res, next) => {
    const { eventId } = req.params;
    Join.findOneAndDelete({
      joiningUser: req.user._id,
      joiningEvent: eventId
    })
      .then(() => {
        res.redirect(`/events/${eventId}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

eventsRouter.post(
  '/:id/comment',
  upload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    const author = req.user._id;
    const { message } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    Comment.create({
      author,
      message: message,
      picture: picture,
      post: id
    })
      .then(() => {
        res.redirect(`/events/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = eventsRouter;
