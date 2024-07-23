const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;
