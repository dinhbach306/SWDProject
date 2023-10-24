const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const accountSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, ['vi-VN']);
        },
      },
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 20,
      required: [true, 'Please provide your password'],
      select: false,
    },
    status: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: ['staff', 'admin', 'user', 'manager'],
        message: 'Role is either',
      },
      default: 'user',
    },
    delFlg: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

accountSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
