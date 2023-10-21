const Cage = require('./../models/entity/cage');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createCage = catchAsync(async (req, res, next) => {
  const newCage = await Cage.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newCage,
    },
  });
});
