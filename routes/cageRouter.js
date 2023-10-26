const express = require('express');
const cageController = require('./../controllers/cageController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/')
  .get(cageController.getAllCages)
  .post(upload.single('filename'), cageController.createCage);

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
