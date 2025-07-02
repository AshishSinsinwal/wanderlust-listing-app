const mongoose = require("mongoose");
const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./utils/Schema");

// --------------------------
// 🛡 Authentication
// --------------------------
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Log in to access features");
    return res.redirect("/login");
  }
  next();
};

// --------------------------
// 📍 Save Redirect URL (for post-login redirect)
// --------------------------
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// --------------------------
// 👤 Authorization: Listing Owner
// --------------------------
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// --------------------------
// 👤 Authorization: Review Author
// --------------------------
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// --------------------------
// ✅ Joi Validation
// --------------------------
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// --------------------------
// 🔎 MongoDB ID Validation
// --------------------------
module.exports.validateObjectId = (req, res, next) => {
  const { id } = req.params;
  console.log("Received ID:", id);
  if (!mongoose.isValidObjectId(id)) {
    throw new ExpressError(400, "Invalid listing ID format");
  }
  next();
};
