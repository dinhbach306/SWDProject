const express = require('express');
const componentController = require('./../controllers/componentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  // .get(userController.getAllComponents)
  .post(
    // authController.protect, // protect all routes after this middleware
    // authController.restrictTo('admin', 'user'), //authorize
    componentController.createComponent,
  );

// router
//   .route('/:id')
//   .get(componentController.getComponent)
//   .patch(componentController.updateComponent)
//   .delete(componentController.deleteComponent);

module.exports = router;
