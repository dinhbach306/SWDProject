const Image = require('./../models/entity/image');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createImage = catchAsync(async (req, res, next) => {
  const newImg = await Image.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newImg,
    },
  });
});
