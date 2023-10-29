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
  .delete(
    authController.protect,
    authController.restrictTo('staff', 'manager'),
    customerController.deleteCustomer,
  );

router.route('/:accountId').patch(customerController.updateCustomer);

module.exports = router;
