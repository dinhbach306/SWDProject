const express = require('express');
const cageComponentController = require('./../controllers/cageComponentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route.get(cageComponentController.getAllCageComponents);

router.route('/:userId').get(cageComponentController.getAllCageComponents);

router
  .route('/:id')
  .get(cageComponentController.getCageComponent)
  .patch(cageComponentController.updateCageComponent)
  .delete(cageComponentController.deleteCageComponent);

module.exports = router;
