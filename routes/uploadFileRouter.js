const express = require('express');
const uploadFileController = require('./../controllers/uploadFileController');
const multer = require('multer');
const uploadRouter = express.Router();

// Thiết lập multer như một middleware để nhận tải lên tệp ảnh
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter
  .route('/')
  .post(upload.single('filename'), uploadFileController.uploadFile);

module.exports = uploadRouter;
