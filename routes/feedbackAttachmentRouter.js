const express = require('express');
const feedbackAttachmentController = require('./../controllers/feedbackAttachmentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(feedbackAttachmentController.getAllFeedbackAttachments)
  .post(feedbackAttachmentController.createFeedbackAttachment);

router
  .route('/:id')
  .get(feedbackAttachmentController.getFeedbackAttachment)
  .patch(feedbackAttachmentController.updateFeedbackAttachment)
  .delete(feedbackAttachmentController.deleteFeedbackAttachment);

module.exports = router;
