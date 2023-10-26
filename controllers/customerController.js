const Customer = require('./../models/entity/customer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createCustomer = catchAsync(async (req, res, next) => {
  const newCustomer = await Customer.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newCustomer,
    },
  });
});

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Customer.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const customers = await features.query;

  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: {
      customers,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  checkExistCustomer(customer);
  res.status(200).json({
    status: 'success',
    data: {
      customer,
    },
  });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  checkExistCustomer(customer);
  res.status(204).json({
    status: 'success',
    data: {
      customer,
    },
  });
});

exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    delFlg: true,
  });
  checkExistCustomer(customer);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

function checkExistCustomer(customer) {
  if (!customer) {
    return next(new AppError('No customer found with that ID', 404));
  }
}
