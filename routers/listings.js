// ==============================
// External Modules & Middleware
// ==============================
const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync");

// ==============================
// Internal Modules
// ==============================
const listingController = require("../controller/listing");
const { isLoggedIn, validateListing, isOwner } = require("../middleware");

// ==============================
// Routes
// ==============================

// 🏠 Index & Create
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Show all listings
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// ➕ New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 📄 Show / ✏️ Update / ❌ Delete Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// 🛠 Edit Listing Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditform)
);

// ==============================
// Export
// ==============================
module.exports = router;
