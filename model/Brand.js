const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Brand Name"],
    unique: true,
  },
});

//Export the model
module.exports = mongoose.model("Brand", brandSchema);
