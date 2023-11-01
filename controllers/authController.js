const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Account = require('./../models/entity/account');
const Customer = require('./../models/entity/customer');
const catchAsync = require('./../utils/catchAsync');
const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Check format birthday is like YYYY/MM/DD=
    if (
      req.body.birthday &&
      !validator.isDate(req.body.birthDay, ['YYYY/MM/DD'])
    ) {
      return next(new AppError('Birthday is not correct format', 400));
    }

    const newAccount = await Account.create({
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    });

    //add accountId to customer
    const newCustomer = await Customer.create({
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      birthDay: req.body.birthDay,
      address: req.body.address,
      account: newAccount._id,
    });
    const token = signToken(newAccount._id);
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newAccount,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  //1) Check if email and password exist
  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phone and password', 400));
  }

  //2) Check if user exists && password is correct
  //Hàm này để lấy ra phone và password, vì password đã bị select: false ở trong model nên phải dùng select('+password')
  const account = await Account.findOne({ phoneNumber }).select('+password');
  if (
    !account ||
    !(await account.correctPassword(password, account.password))
  ) {
    return next(new AppError('Incorrect phone or password', 401));
  }

  //3) If everything ok, send token and user data to client
  const data = {};
  data.account = account;
  data.token = signToken(account._id);
  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //Bắt đầu từ vị trí thứ 7
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  //2) Verification token
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await Account.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  // //4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401),
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//Authorize
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

//Get profile user
exports.getUser = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  //Not get account
  const customer = await Customer.find({
    account: account._id,
  })
    .select('-account')
    .exec();

  checkExistAccount(account);
  res.status(200).json({
    status: 'success',
    data: {
      customer,
      status: account.status,
    },
  });
});

function checkExistAccount(account) {
  if (!account) {
    return next(new AppError('No account found with that ID', 404));
  }
}
