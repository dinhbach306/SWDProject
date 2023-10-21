const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    path: Array,
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

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
