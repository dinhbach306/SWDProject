const express = require('express');
const imageController = require('./../controllers/imageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  // .get(userController.getAllCages)
  .post(imageController.createImage);

// router
//   .route('/:id')
//   .get(cageController.getCage)
//   .patch(cageController.updateCage)
//   .delete(cageController.deleteCage);

module.exports = router;
