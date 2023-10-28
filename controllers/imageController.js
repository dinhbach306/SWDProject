const Image = require('./../models/entity/image');
const catchAsync = require('./../utils/catchAsync');
const uploadFile = require('./../utils/uploadFile');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.getAllImages = catchAsync(async (req, res, next) => {
  //Get all cage without userId
  const features = new APIFeatures(Image.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const imgs = await features.query;

  res.status(200).json({
    status: 'success',
    results: imgs.length,
    data: {
      imgs,
    },
  });
});

exports.getImage = catchAsync(async (req, res, next) => {
  //Get cage and populate with image
  const img = await Image.findById(req.params.id);
  checkExistImage(img);
  res.status(200).json({
    status: 'success',
    data: {
      img,
    },
  });
});

exports.updateImage = catchAsync(async (req, res, next) => {
  const arrayImage = req.files;
  const data = await uploadFile.uploadFile(arrayImage);
  console.log(data);
  const image = await Image.findByIdAndUpdate(
    req.params.id,
    {
      imagePath: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  checkExistImage(image);
  res.status(204).json({
    status: 'success',
    data: {
      image,
    },
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const img = await Image.findByIdAndUpdate(req.params.id, { delFlg: true });
  checkExistImage(img);
  res.status(204).json({
    status: 'delete successfully',
  });
});

function checkExistImage(cage) {
  if (!cage) {
    return next(new AppError('No image found with that ID', 404));
  }
}
