const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    color: {
      type: String,
    },
    image: {
      type: Array,
    },
    sold: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: {
          type: Number,
        },
        comment: {
          type: String,
        },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
