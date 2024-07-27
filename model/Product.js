const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
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
    rating: [
      {
        star: {
          type: Number,
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
