const Cage = require('./../models/entity/cage');
const Image = require('./../models/entity/image');
const CageComponent = require('./../models/entity/cageComponent');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');
const uploadFile = require('./../utils/uploadFile');
exports.createCage = catchAsync(async (req, res, next) => {
  //Upload image
  if (!req.body.userId) {
    const mainImage = req.files.splice(0, 1);
    const secondImage = req.files.splice(1, req.files.length - 1);
    const secondImageArray = uploadFile.uploadFile(secondImage).then((data) => {
      const image = Image.create({
        imagePath: data,
      }).then((data) => {
        req.body.image = data._id;
        //handle array image
        // get the first image in array
        const img = uploadFile.uploadFile(mainImage).then((data) => {
          req.body.imagePath = data[0];

          const cage = Cage.create(req.body);
        });
      });
    });
  } else {
    const cage = await Cage.create(req.body);
    const cageComponent = await CageComponent.create({
      cage: [cage._id],
      component: req.body.component,
    });
  }
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
  checkExistCage(cage, next);
  res.status(200).json({
    status: 'success',
    data: {
      component: cage,
    },
  });
});

exports.updateCage = catchAsync(async (req, res, next) => {
  if (req.file) {
    console.log('main');
    const image = await uploadFile.uploadFile([req.file]);
    req.body.imagePath = image[0];
  }
  const cage = await Cage.findByIdAndUpdate(req.params.id, req.body);
  if (req.files) {
    console.log('phu');
    const data = await uploadFile.uploadFile(req.files);
    const image = await Image.findByIdAndUpdate(
      cage.image,
      {
        imagePath: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    checkExistImage(image, next);
  }
  checkExistCage(cage, next);
  res.status(204).json({
    status: 'update successfully',
  });
});
exports.updateCageCustom = catchAsync(async (req, res, next) => {
  const cage = await Cage.findById(req.params.cageId);
  checkExistCageWithStatus(cage, 'Pending', next);
  cage.status = 'CUS';
  cage.price = req.body.price;
  cage.description = req.body.description;
  cage.save();
  //save to database

  //
  res.status(200).json({
    status: 'success',
    data: {
      component: cage,
    },
  });
});
exports.deleteCage = catchAsync(async (req, res, next) => {
  const cage = await Cage.findByIdAndUpdate(req.params.id, { delFlg: true });
  checkExistCage(cage, next);
  res.status(204).json({
    status: 'delete successfully',
  });
});
exports.getCustomCages = catchAsync(async (req, res, next) => {
  const customCages = await Cage.find({ userId: req.user.id });
  const customCagesComponent = await Promise.all(
    customCages.map((customCage) =>
      CageComponent.find({ cage: customCage._id }).populate('cage'),
    ),
  );

  res.json(customCagesComponent);
});

exports.checkPending = catchAsync(async (req, res, next) => {
  const customCages = await Cage.find({ userId: req.user.id });
  const customCagesComponent = await Promise.all(
    customCages.map((customCage) =>
      CageComponent.find({ cage: customCage._id }).populate('cage'),
    ),
  );
  let isPending;
  customCagesComponent.forEach((cus) => {
    isPending = cus[0].cage.filter((i) => i.status == 'Pending');
  });
  if (isPending.length != 0) {
    res.json('Pending');
  }
});
exports.aliasTopCageCheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  next();
};
exports.getAllWithDeletedItem = catchAsync(async (req, res, next) => {
  //Get all cage without userId
  const features = new APIFeatures(
    Cage.find({ userId: { $exists: false } }).set('querySetting', 'all'),
    req.query,
  );
  const cages = await features.query;
  res.status(200).json({
    status: 'success',
    results: cages.length,
    data: {
      cages,
    },
  });
});
exports.getCageByName = catchAsync(async (req, res, next) => {
  // LIKE OPERATOR
  const features = new APIFeatures(
    Cage.find({
      name: { $regex: req.body.name },
      delFlg: { $ne: true },
    }),
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

function checkExistCage(cage, next) {
  if (!cage) {
    return next(new AppError('No component found with that ID', 404));
  }
}
function checkExistCageWithStatus(cage, status, next) {
  checkExistCage(cage, next);
  if (cage.status != status) {
    return next(
      new AppError(
        'No component found with that ID and status: ' + status,
        404,
      ),
    );
  }
}

function checkExistImage(cage, next) {
  if (!cage) {
    return next(new AppError('No image found with that ID', 404));
  }
}
