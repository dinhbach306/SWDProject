const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    imagePath: Array,
    delFlg: {
      type: Boolean,
      default: false,
    },
    cage: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cage',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
