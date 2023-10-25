const express = require('express');
const customerController = require('./../controllers/customerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.getAllCustomers,
  )
  .post(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.createCustomer,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.getCustomer,
  )
  .patch(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.updateCustomer,
  )
  .delete(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.deleteCustomer,
  );

module.exports = router;
