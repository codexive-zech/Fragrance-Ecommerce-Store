const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Product Category"],
    unique: true,
  },
});

//Export the model
module.exports = mongoose.model("BlogCategory", blogCategorySchema);
