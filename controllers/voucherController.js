const Voucher = require('./../models/entity/voucher');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createVoucher = catchAsync(async (req, res, next) => {
  const newVoucher = await Voucher.create(req.body);

  res.status(201).json({
    status: 'create successfully',
  });
});

exports.getAllVouchers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Voucher.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const vouchers = await features.query;

  res.status(200).json({
    status: 'success',
    results: vouchers.length,
    data: {
      vouchers,
    },
  });
});

exports.getVoucher = catchAsync(async (req, res, next) => {
  //Get cage and populate with image
  const voucher = await Voucher.findById(req.params.id);
  checkExistVoucher(voucher, next);
  res.status(200).json({
    status: 'success',
    data: {
      voucher,
    },
  });
});

exports.updateVoucher = catchAsync(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Nếu không có tạo mới
    runValidators: true, //Luôn chạy validator
  });
  checkExistVoucher(voucher, next);
  res.status(204).json({
    status: 'update successfully',
  });
});

exports.deleteVoucher = catchAsync(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndUpdate(req.params.id, {
    delFlg: true,
  });
  checkExistVoucher(voucher, next);
  res.status(204).json({
    status: 'delete successfully',
  });
});

function checkExistVoucher(voucher, next) {
  if (!voucher) {
    return next(new AppError('No voucher found with that ID', 404));
  }
}
