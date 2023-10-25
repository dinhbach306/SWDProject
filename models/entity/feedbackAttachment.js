const mongoose = require('mongoose');

const feedbackAttachmentSchema = new mongoose.Schema(
  {
    path: Array,
    delFlg: {
      type: Boolean,
      default: false,
    },
    orderDetail: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'OrderDetail',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const FeedbackAttachment = mongoose.model(
  'FeedbackAttachment',
  feedbackAttachmentSchema,
);
module.exports = FeedbackAttachment;
