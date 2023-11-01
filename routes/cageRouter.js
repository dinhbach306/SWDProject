const express = require('express');
const cageController = require('./../controllers/cageController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const customeImageUpload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'filename', maxCount: 1 },
  { name: 'filenames', maxCount: 5 },
]);
router
  .route('/')
  .get(cageController.getAllCages)
  .post(upload.array('filenames'), cageController.createCage);

router
  .route('/:id')
  .get(cageController.getCage)
  .patch(customeImageUpload, cageController.updateCage)
  .delete(cageController.deleteCage);

router
  .route('/searchTopCageCheap')
  .post(cageController.aliasTopCageCheap, cageController.getCageByName);

router.route('/searchName').post(cageController.getCageByName);

router
  .route('/customCages/:cageId')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'staff', 'manager'),
    cageController.updateCageCustom,
  );

router
  .route('/customCages/:userId')
  .get(authController.protect, cageController.getCustomCages);

router
  .route('/customCages/pending/:userId')
  .get(authController.protect, cageController.checkPending);

router
  .route('/getAllWithDeletedItem')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff', 'manager'),
    cageController.getAllWithDeletedItem,
  );

module.exports = router;
