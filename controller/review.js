const mongoose = require("mongoose");
const Review = require("../models/review");
const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError");

// ==============================
// ✍️ POST: New Review
// ==============================
module.exports.newReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ExpressError(400, "Invalid listing ID format");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.review.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review Created!");
  res.redirect(`/listings/${id}`);
};

// ==============================
// ❌ DELETE: Review
// ==============================
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });

  // Delete the review itself
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
