'use strict';

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const upload = multer({
  storage: new multerStorageCloudinary.CloudinaryStorage({
    cloudinary: cloudinary.v2
  })
});

module.exports = upload;
