const jwt = require('jsonwebtoken');
const Customer = require('./../models/entity/customer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
