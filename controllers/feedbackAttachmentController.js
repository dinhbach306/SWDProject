const FeedbackAttachment = require('../models/entity/feedbackAttachment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/mongoUtils');

exports.createFeedbackAttachment = catchAsync(async (req, res, next) => {
  const newFeedbackAttachment = await FeedbackAttachment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newFeedbackAttachment,
    },
  });
});

exports.getAllFeedbackAttachments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(FeedbackAttachment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const feedbackAttachments = await features.query;

  res.status(200).json({
    status: 'success',
    results: feedbackAttachments.length,
    data: {
      feedbackAttachments,
    },
  });
});

exports.getFeedbackAttachment = catchAsync(async (req, res, next) => {
  const feedbackAttachment = await FeedbackAttachment.findById(req.params.id);
  checkExistFeedbackAttachment(feedbackAttachment);
  res.status(200).json({
    status: 'success',
    data: {
      feedbackAttachment,
    },
  });
});

exports.updateFeedbackAttachment = catchAsync(async (req, res, next) => {
  const feedbackAttachment = await FeedbackAttachment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  checkExistFeedbackAttachment(feedbackAttachment);
  res.status(204).json({
    status: 'success',
    data: {
      customer,
    },
  });
});

exports.deleteFeedbackAttachment = catchAsync(async (req, res, next) => {
  const feedbackAttachment = await FeedbackAttachment.findByIdAndUpdate(
    req.params.id,
    {
      delFlg: true,
    },
  );
  checkExistFeedbackAttachment(feedbackAttachment);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

function checkExistFeedbackAttachment(feedbackAttachment) {
  if (!feedbackAttachment) {
    return next(new AppError('No feedbackAttachment found with that ID', 404));
  }
}
