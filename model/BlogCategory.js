const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Blog Category"],
    unique: true,
  },
});

//Export the model
module.exports = mongoose.model("BlogCategory", blogCategorySchema);
