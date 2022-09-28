const ValidationError = require("./ValidationError");

const errorLogger = (error, defaultMessage) => {
  if (error instanceof ValidationError) {
    console.log(error.message);
    console.log(error);
    throw error;
  }

  console.log(defaultMessage);
  console.log(error);
  throw new Error(defaultMessage);
};

module.exports = errorLogger;