// ==============================
// Reviews Router
// ==============================
const express = require("express");
const router = express.Router({ mergeParams: true });

// ==============================
// Modules & Middleware
// ==============================
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../utils/Schema");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listings");
const Review = require("../models/review");
const reviewController = require("../controller/review");

const {
  validateReview,
  validateObjectId,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");

// ==============================
// Routes
// ==============================

// 📝 Create a new review
router.post(
  "/",
  isLoggedIn,
  validateObjectId,
  validateReview,
  wrapAsync(reviewController.newReview)
);

// ❌ Delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

// ==============================
// Export
// ==============================
module.exports = router;
