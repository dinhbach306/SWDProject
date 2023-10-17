const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    validator: function (val) {
      const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
      return regexPhoneNumber.test(val);
    },
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 20,
    required: [true, 'Please provide your password'],
  },
  status: {
    type: Number,
    default: 0,
    required: [true, 'Please provide your status'],
  },
  role: {
    type: String,
    enum: {
      values: ['staff', 'admin', 'user', 'manager'],
      message: 'Role is either',
    },
    require: [true, 'Please provide your role'],
    maxLength: 6,
  },
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
