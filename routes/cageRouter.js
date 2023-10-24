const express = require('express');
const cageController = require('./../controllers/cageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(cageController.getAllCages)
  .post(cageController.createCage);

router
  .route('/:id')
  .get(cageController.getCage)
  .patch(cageController.updateCage)
  .delete(cageController.deleteCage);

router
  .route('/searchTopCageCheap')
  .post(
    cageController.aliasTopCageCheap,
    cageController.getTop5CageByNameAndPrice,
  );

router.route('/searchName').post(cageController.getTop5CageByNameAndPrice);

module.exports = router;
