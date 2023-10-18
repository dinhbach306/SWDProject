const express = require('express');
const authController = require('../controllers/authController');
const accountRouter = express.Router();

accountRouter.post('/signup', authController.signup);
accountRouter.get('/login', authController.login);

module.exports = accountRouter;
