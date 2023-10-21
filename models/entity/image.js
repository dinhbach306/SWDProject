const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    imagePath: Array,
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
