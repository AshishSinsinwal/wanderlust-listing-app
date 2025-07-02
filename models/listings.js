const mongoose = require("mongoose");
const Review = require("./review");

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: String,
    url: {
      type: String,
      set: v =>
        v === ""
          ? "https://unsplash.com/photos/a-house-on-a-small-island-in-the-middle-of-a-lake-Hq-j-COkMok"
          : v,
    },
  },

  price: Number,
  location: String,
  country: String,

  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic-cities",
      "castle",
      "pools",
      "camping",
      "farms",
    ],
  },

  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },

  views: {
    type: Number,
    default: 0,
  },

  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 🔁 Cascade delete reviews when listing is deleted
ListingSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.review } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
