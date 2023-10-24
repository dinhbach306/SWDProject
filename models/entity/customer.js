const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      maxLength: 50,
      minLength: 2,
    },
    firstName: {
      type: String,
      maxLength: 50,
      minLength: 2,
    },
    birthDay: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isDate(v, ['YYYY/MM/DD']); // YYYY-MM-DD
        },
      },
    },
    address: {
      type: String,
      maxLength: 200,
    },
    point: {
      type: Number,
      default: 0,
    },
    delFlg: {
      type: Boolean,
      default: false,
    },
    account: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
