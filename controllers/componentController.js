const Component = require('./../models/entity/component');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createComponent = catchAsync(async (req, res, next) => {
  const newComponent = await Component.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newComponent,
    },
  });
});
