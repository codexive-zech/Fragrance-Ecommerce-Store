const mongoose = require("mongoose");
const BadRequestError = require("../errors/badRequest");

const validateMongoDBId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new BadRequestError("This ID is Not Valid");
  }
};

module.exports = validateMongoDBId;
