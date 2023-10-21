const express = require('express');
const cageController = require('./../controllers/cageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  // .get(userController.getAllCages)
  .post(cageController.createCage);

// router
//   .route('/:id')
//   .get(cageController.getCage)
//   .patch(cageController.updateCage)
//   .delete(cageController.deleteCage);

module.exports = router;
