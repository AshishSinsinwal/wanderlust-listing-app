// ==============================
// Joi Validation Schemas
// ==============================
const Joi = require("joi");

// ==============================
// Listing Schema
// ==============================
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().uri().required(),
    country: Joi.string().required(),
    category: Joi.string().optional(),
  }).required(),
});

// ==============================
// Review Schema
// ==============================
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
