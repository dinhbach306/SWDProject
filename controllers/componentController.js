const Component = require('./../models/entity/component');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createComponent = catchAsync(async (req, res, next) => {
  const newComponent = await Component.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newComponent,
    },
  });
});

exports.getAllComponents = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Component.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const components = await features.query;

  res.status(200).json({
    status: 'success',
    results: components.length,
    data: {
      components,
    },
  });
});

exports.getComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findById(req.params.id);
  checkExistComponent(component);
  res.status(200).json({
    status: 'success',
    data: {
      component,
    },
  });
});

exports.updateComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Nếu không có tạo mới
    runValidators: true, //Luôn chạy validator
  });
  checkExistComponent(component);
  res.status(204).json({
    status: 'success',
    data: {
      component,
    },
  });
});

exports.deleteComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findByIdAndDelete(req.params.id);
  checkExistComponent(component);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

function checkExistComponent(component) {
  if (!component) {
    return next(new AppError('No component found with that ID', 404));
  }
}
