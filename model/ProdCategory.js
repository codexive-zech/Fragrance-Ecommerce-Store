const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const prodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Product Category"],
    unique: true,
  },
});

//Export the model
module.exports = mongoose.model("ProdCategory", prodCategorySchema);
