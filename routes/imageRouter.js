const express = require('express');
const imageController = require('./../controllers/imageController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.route('/').get(imageController.getAllImages);

router
  .route('/:id')
  .get(imageController.getImage)
  .patch(upload.array('filenames'), imageController.updateImage)
  .delete(imageController.deleteImage);

module.exports = router;
