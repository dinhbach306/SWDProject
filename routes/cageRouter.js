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
  .post(cageController.aliasTopCageCheap, cageController.getCageByName);

router.route('/searchName').post(cageController.getCageByName);

module.exports = router;
