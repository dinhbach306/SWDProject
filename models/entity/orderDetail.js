const mongoose = require('mongoose');
const validator = require('validator');

const orderDetailSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, 'Please provide your price'],
    },
    status: {
      type: String,
    },
    content: {
      type: String,
      maxLength: 1000,
    },
    postDate: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']);
        },
      },
    },
    rating: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide your quantity'],
    },
    delFlg: {
      type: Boolean,
      default: false,
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
    cage: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cage',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderDetailSchema.pre(/^find/, function (next) {
  this.find({ delFlg: { $ne: true } });
  next();
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;
