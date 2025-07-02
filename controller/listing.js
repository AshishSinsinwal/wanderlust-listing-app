const axios = require("axios");
const mongoose = require("mongoose");
const Listing = require("../models/listings");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const cloudinary = require("cloudinary").v2;

// ===========================
// 🌍 Geocoding Helper
// ===========================
async function geocodeAddress(address) {
  const url = "https://nominatim.openstreetmap.org/search";
  const params = {
    q: address,
    format: "json",
    limit: 1,
  };

  try {
    const response = await axios.get(url, { params });
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
      };
    }
  } catch (e) {
    throw new ExpressError(500, "Geocoding failed. Please try again.");
  }
}

// ===========================
// 📄 GET: All Listings
// ===========================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ===========================
// 🆕 GET: New Listing Form
// ===========================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ===========================
// 🔍 GET: Single Listing
// ===========================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID");

  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  listing.views += 1;

  if (listing.review?.length) {
    listing.review.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  await listing.save();
  res.render("listings/show", { listing });
};

// ===========================
// 📤 POST: Create Listing
// ===========================
module.exports.createListing = async (req, res) => {
  const { title, description, price, country, location, category } = req.body.listing;

  try {
    const fullAddress = `${location}, ${country}`;
    const geo = await geocodeAddress(fullAddress);

    const newListing = new Listing({
      title,
      description,
      price,
      country,
      location,
      category,
      owner: req.user._id,
      coordinates: {
        type: "Point",
        coordinates: [geo.lng, geo.lat],
      },
    });

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    req.flash("error", "Invalid location. Please enter a more specific address.");
    res.redirect("/listings/new");
  }
};

// ===========================
// ✏️ GET: Edit Form
// ===========================
module.exports.renderEditform = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID");

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// ===========================
// 🛠 PATCH: Update Listing
// ===========================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { listing: listingData } = req.body;

  if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID");

  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  if (!listingData.title || !listingData.price) {
    throw new ExpressError(400, "Title and Price are required.");
  }

  try {
    listing.title = listingData.title;
    listing.description = listingData.description;
    listing.price = listingData.price;
    listing.country = listingData.country;
    listing.location = listingData.location;
    listing.category = listingData.category;

    const fullAddress = `${listingData.location}, ${listingData.country}`;
    const geo = await geocodeAddress(fullAddress);
    listing.coordinates = {
      type: "Point",
      coordinates: [geo.lng, geo.lat],
    };

    if (req.file) {
      await cloudinary.uploader.destroy(listing.image.filename); // remove old
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    req.flash("error", "Invalid location. Please enter a more specific address.");
    res.redirect(`/listings/${id}/edit`);
  }
};

// ===========================
// ❌ DELETE: Listing
// ===========================
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID");

  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  if (listing.image?.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
