const Order = require('./../models/entity/order');
const OrderDetail = require('./../models/entity/orderDetail');
const Cage = require('./../models/entity/cage');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createOrder = catchAsync(async (req, res, next) => {
  console.log(req.body.cageId, req.body.cageArray)
  //update quantity cage
  const cages = await Cage.findById({
    _id: {
      $in: req.body.cageArray.map((item) => item.cageId),
    },
  });

  const cageArray = req.body.cageArray;

  const isHasCage = cages.every((cage) => {
    const _cageRequest = cageArray.find((item) => item.cageId === cage.id);
    return cage.inStock - _cageRequest.quantity > 0;
  });
  console.log(isHasCage)
  if (!isHasCage) {
    return next(new AppError('Not enough cage in stock', 400));
  }

  Cage.bulkWrite(
    cageArray.map((item) => ({
      updateOne: {
        filter: { _id: item.cageId },
        update: { $inc: { inStock: -item.quantity } },
      },
    })),
  );

  const quantityTotal = cageArray.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const newOrder = await Order.create(req.body);

  const orderDetails = await OrderDetail.create({
    order: newOrder._id,
    price: req.body.price,
    cage: req.body.cageId,
    quantity: quantityTotal,
  });

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

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
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
  const order = await Order.findByIdAndUpdate(req.params.id, {
    delFlg: true,
  });
  checkExitsOrder(order, next);
  res.status(204).json({
    status: 'delete successfully',
  });
});

function checkExitsOrder(voucher, next) {
  if (!voucher) {
    return next(new AppError('No voucher found with that ID', 404));
  }
}
