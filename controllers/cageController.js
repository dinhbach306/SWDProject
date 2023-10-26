const Cage = require('./../models/entity/cage');
const Image = require('./../models/entity/image');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');
const uploadFile = require('./../utils/uploadFile');

exports.createCage = catchAsync(async (req, res, next) => {
  //Upload image
  const img = uploadFile.uploadFile(req, res);
  // const image = await Image.create(img);
  // const imageId = (req.body.image = image._id);
  // const imageName = (req.body.imagePath = image.name);
  console.log(img);
  //Create cage
  // const cage = await Cage.create(req.body);

  res.status(201).json({
    status: 'create successfully',
  });
});

exports.getAllCages = catchAsync(async (req, res, next) => {
  //Get all cage without userId
  const features = new APIFeatures(
    Cage.find({ userId: { $exists: false } }),
    req.query,
  )
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
  //Get cage and populate with image
  const cage = await Cage.findById(req.params.id)
    .populate('image', 'imagePath')
    .exec();
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
  const cage = await Cage.findByIdAndUpdate(req.params.id, { delFlg: true });
  checkExistCage(cage);
  res.status(204).json({
    status: 'delete successfully',
  });
});

exports.aliasTopCageCheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  next();
};

exports.getCageByName = catchAsync(async (req, res, next) => {
  // LIKE OPERATOR
  const features = new APIFeatures(
    Cage.find({ name: { $regex: req.body.name, $options: 'i' } }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const cage = await features.query;
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
