const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 1,
    },
    paymentDate: {
      type: String,
      required: [true, 'Please provide your payment date'],
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
    },
    deliveryDate: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
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
      required: [true, 'Please provide your total'],
      default: 0,
    },
    shipFee: {
      type: Number,
      required: [true, 'Please provide your ship fee'],
      default: 0,
    },
    voucher: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Voucher',
      },
    ],
    customer: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
