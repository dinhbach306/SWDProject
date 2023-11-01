const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authController = require('./authController');
const Order = require('./../models/entity/order');
const Account = require('./../models/entity/account');
const Customer = require('./../models/entity/customer');
const OrderDetail = require('./../models/entity/orderDetail');
const Cage = require('./../models/entity/cage');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');
const Account = require('./../models/entity/account');
const Customer = require('./../models/entity/customer');
const { log } = require('console');

exports.createOrder = catchAsync(async (req, res, next) => {
  //update quantity cage
  const cages = await Cage.find({
    _id: {
      $in: req.body.cageArray.map((item) => item.cageId),
    },
  });

  const cageArray = req.body.cageArray;

  const isHasCage = cages.every((cage) => {
    const _cageRequest = cageArray.find((item) => item.cageId === cage.id);
    return cage.inStock - _cageRequest.quantity > 0;
  });
  console.log(isHasCage);
  if (!isHasCage) {
    return next(new AppError('Not enough cage in stock', 400));
  }

  Cage.bulkWrite(
    cageArray.map((item) => ({
      updateOne: {
        filter: { id: item.cageId },
        update: {
          $set: {
            inStock:
              cages.find((cage) => cage.id === item.cageId).inStock -
              item.quantity,
          },
        },
      },
    })),
  );

  const quantityTotal = cageArray.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const newOrder = await Order.create({
    status: req.body.status,
    paymentDate: req.body.paymentDate,
    address: req.body.address,
    total: req.body.total,
    shipFee: req.body.shipFee,
    customer: req.body.customerId,
  });

  const orderDetails = await OrderDetail.insertMany(
    cageArray.map((item) => ({
      order: newOrder._id,
      price: item.price,
      cage: [item.cageId],
      quantity: item.quantity,
    })),
  );

  res.status(201).json({
    status: 'create successfully',
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const orders = await features.query;
  const orderByStatus = orders.reduce((result, item) => {
    if (result[item.status]) {
      result[item.status].push(item);
    } else {
      result[item.status] = [item];
    }
    return result;
  }, {});

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orderByStatus,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  //Get cage and populate with image
  const order = await Order.findById(req.params.id);
  checkExitsOrder(order, next);
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true, //Luôn chạy validator
  });
  checkExitsOrder(order, next);
  res.status(204).json({
    status: 'update successfully',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  console.log("id", decoded.id)
  const order = await Order.findById(req.params.id);
  console.log(order);
  const account = await Account.findById(decoded.id);

  //Not get account
  const currentUser = await Customer.find({
    account: account._id,
  })
    .select('-account')
    .exec();
  console.log(currentUser);
  checkCurrentCustomerHasOrder(currentUser, order, next);
  order.status = "Canceled";
  order.save();
  // const order = await Order.findByIdAndUpdate(req.params.id, {
  //   delFlg: true,
  // });
  // checkExitsOrder(order, next);
  res.status(204).json({
    status: 'delete successfully',
  });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      runValidators: true, //Luôn chạy validator
    },
  );
  checkExitsOrder(order, next);
  res.status(204).json({
    status: 'update successfully',
  });
});

exports.getOrderByUser = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.params.userId);
  const customer = await Customer.findOne({
    account: account._id,
  });

  console.log(customer);
  const orders = await Order.find({
    customer: [customer._id],
  });

  const orderByStatus = orders.reduce((result, item) => {
    if (result[item.status]) {
      result[item.status].push(item);
    } else {
      result[item.status] = [item];
    }
    return result;
  }, {});

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orderByStatus,
  });
});

function checkExitsOrder(voucher, next) {
  if (!voucher) {
    return next(new AppError('No voucher found with that ID', 404));
  }
}
// check if current customer has purchase order (by id) or not
function checkCurrentCustomerHasOrder(customer, order, next) {
  if (!customer || !order || customer._id != order.customer._id) {
    return next(new AppError('No account found with that ID', 404));
  }
  if(order.status != 'Processing'){
    return next(new AppError('Order is status is not processing', 404));
  }
}