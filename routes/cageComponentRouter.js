const express = require('express');
const cageComponentController = require('./../controllers/cageComponentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    cageComponentController.getAllCageComponentsForStaff,
  );

router
  .route('/:userId')
  .get(
    authController.protect,
    cageComponentController.getAllCageComponentsForUser,
  );

router
  .route('/:id')
  .get(cageComponentController.getCageComponent)
  .patch(cageComponentController.updateCageComponent)
  .delete(cageComponentController.deleteCageComponent);

module.exports = router;
