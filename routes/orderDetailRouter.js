const express = require('express');
const router = express.Router();
const orderDetailController = require('./../controllers/orderDetailController');
const authController = require('./../controllers/authController');


router
  .route('/feedback/:id')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    orderDetailController.createFeedback,
  );
router.get("/feedback/cage/:id", orderDetailController.getFeedbackByCageId);

module.exports = router;    