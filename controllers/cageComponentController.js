const CageComponent = require('./../models/entity/cageComponent');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.getAllCageComponents = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    CageComponent.find({ userId: req.params.userId }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const cageComponents = await features.query;

  res.status(200).json({
    status: 'success',
    results: cageComponents.length,
    data: {
      cageComponents,
    },
  });
});

exports.getCageComponent = catchAsync(async (req, res, next) => {
  const cageComponent = await CageComponent.findById(req.params.id);
  checkExistCageComponent(compocageComponentnent, next);
  res.status(200).json({
    status: 'success',
    data: {
      cageComponent,
    },
  });
});

exports.updateCageComponent = catchAsync(async (req, res, next) => {
  const cageComponent = await CageComponent.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, //Nếu không có tạo mới
      runValidators: true, //Luôn chạy validator
    },
  );
  checkExistCageComponent(cageComponent, next);
  res.status(204).json({
    status: 'success',
    data: {
      cageComponent,
    },
  });
});

exports.deleteCageComponent = catchAsync(async (req, res, next) => {
  const cageComponent = await CageComponent.findByIdAndUpdate(req.params.id, {
    delFlg: true,
  });
  checkExistCageComponent(cageComponent, next);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

function checkExistCageComponent(cageComponent, next) {
  if (!cageComponent) {
    return next(new AppError('No cage component found with that ID', 404));
  }
}
