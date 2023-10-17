const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please provide your price'],
  },
  status: {
    type: Number,
    default: 0,
    required: [true, 'Please provide your status'],
  },
  content: {
    type: String,
    maxLength: 1000,
  },
  postDate: {
    type: String,
  },
  rating: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide your quantity'],
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  cage: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cage',
  },
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;
