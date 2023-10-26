const express = require('express');
const voucherController = require('./../controllers/voucherController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(voucherController.getAllVouchers)
  .post(voucherController.createVoucher);

router
  .route('/:id')
  .get(voucherController.getVoucher)
  .patch(voucherController.updateVoucher)
  .delete(voucherController.deleteVoucher);

module.exports = router;
