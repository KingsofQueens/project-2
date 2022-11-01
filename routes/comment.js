'use strict';

const express = require('express');
const Comment = require('./../models/comment');
const routeGuardMiddleware = require('../middleware/route-guard');
const upload = require('./upload');
const commentRouter = express.Router();

commentRouter.post(
  '/:id/comment',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const { message } = req.body;
    const { path } = req.file;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    Comment.create({
      name,
      message,
      picture,
      post: req.event._id
    })
      .then(() => {
        res.redirect(`/post/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = commentRouter;
