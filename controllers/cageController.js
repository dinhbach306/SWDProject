const Cage = require('./../models/entity/cage');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createCage = catchAsync(async (req, res, next) => {
  const newCage = await Cage.create(req.body);

  res.status(201).json({
    status: 'create successfully',
  });
});

exports.getAllCages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Cage.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const cages = await features.query;

  res.status(200).json({
    status: 'success',
    results: cages.length,
    data: {
      cages,
    },
  });
});

exports.getCage = catchAsync(async (req, res, next) => {
  const cage = await Cage.findById(req.params.id);
  checkExistCage(cage);
  res.status(200).json({
    status: 'success',
    data: {
      component: cage,
    },
  });
});

exports.updateCage = catchAsync(async (req, res, next) => {
  const cage = await Cage.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Nếu không có tạo mới
    runValidators: true, //Luôn chạy validator
  });
  checkExistCage(cage);
  res.status(204).json({
    status: 'update successfully',
  });
});

exports.deleteCage = catchAsync(async (req, res, next) => {
  const cage = await Cage.findByIdAndDelete(req.params.id);
  checkExistCage(cage);
  res.status(204).json({
    status: 'delete successfully',
  });
});

exports.getCageByName = catchAsync(async (req, res, next) => {
  // LIKE OPERATOR
  const cage = await Cage.find({ name: { $regex: req.body.name } });
  checkExistCage(cage);
  res.status(200).json({
    status: 'success',
    data: {
      component: cage,
    },
  });
});

function checkExistCage(cage) {
  if (!cage) {
    return next(new AppError('No component found with that ID', 404));
  }
}
