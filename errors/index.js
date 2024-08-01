const notFoundError = require("./notFound");
const badRequestError = require("./badRequest");
const unauthenticatedError = require("./unauthenticated");
const unauthorizedError = require("./unauthorized");

module.exports = {
  badRequestError,
  unauthenticatedError,
  unauthorizedError,
  notFoundError,
};
