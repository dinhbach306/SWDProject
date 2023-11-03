const OrderDetail = require('./../models/entity/orderDetail');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Account = require('./../models/entity/account');
const Customer = require('../models/entity/customer');

exports.createFeedback = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // const
  const account = await Account.findById(decoded.id);
  const currentCustomer = await Customer.find({
    account: account._id,
  })
    .select('-account')
    .exec();
  const orderDetail = await OrderDetail.findById(req.params.id).populate({
    path: 'order',
    populate: {
      path: 'customer',
      populate: {
        path: 'account',
      },
    },
  });
  console.log(currentCustomer);
  if (!orderDetail || orderDetail.order.customer._id !== currentCustomer._id) {
    return next(new AppError('No order found with that ID', 404));
  }
  orderDetail.content = req.body.content;
  let rating = 0;
  try {
    rating = parseInt(req.body?.rating);
    if (rating < 1 || rating > 5) {
      throw new Error('Rating is invalid');
    }
    orderDetail.rating = rating;
  } catch (err) {
    return next(new AppError('Rating is invalid', 404));
  }
  orderDetail.save();
  //   console.log(orderDetail);
  res.status(204).json();
});

exports.getFeedbackByCageId = catchAsync(async (req, res, next) => {
  const cageId = req.params.id;
  const orderDetails = await OrderDetail.find({
    cage: cageId,
    rating: {
      $ne: null,
    },
  }).populate({
    path: 'order',
    populate: {
      path: 'customer',
    },
  });
  const feedbacks = [];
  orderDetails.forEach((orderDetail) => {
    const customer = orderDetail.order.customer[0]
    feedbacks.push({
      content: orderDetail.content,
      rating: orderDetail.rating,
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });
  });
  return res.status(200).json({
    status: 'success',
    data: {
      feedbacks,
    },
  });
});
module.exports = exports;
