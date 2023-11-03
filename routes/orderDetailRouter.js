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
module.exports = router;    