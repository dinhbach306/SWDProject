const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  status: {
    type: Number,
    default: 0,
    required: [true, 'Please provide your status'],
  },
  orderDate: {
    type: String,
    required: [true, 'Please provide your order date'],
  },
  paymentDate: {
    type: String,
  },
  deliveryDate: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
  },
  total: {
    type: Number,
    default: 0,
  },
  shipFee: {
    type: Number,
    default: 0,
  },
  // voucher: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Voucher',
  // },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
});
