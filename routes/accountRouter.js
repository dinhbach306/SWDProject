const express = require('express');
const authController = require('../controllers/authController');
const accountRouter = express.Router();

accountRouter.post('/signup', authController.signup);
accountRouter.post('/login', authController.login);

module.exports = accountRouter;
