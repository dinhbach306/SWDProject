const express = require('express');
const authController = require('../controllers/authController');
const accountRouter = express.Router();

accountRouter.post('/signup', authController.signup);
accountRouter.post('/login', authController.login);

accountRouter.get('/:id', authController.getUser);

module.exports = accountRouter;
