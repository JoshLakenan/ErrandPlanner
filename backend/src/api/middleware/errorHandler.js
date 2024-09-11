/**
 * Middleware function that handles errors thrown throughout the request
 * response cycle and sends an appropriate http response to the client.
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error object in handler", err);
  res.status(err.httpStatusCode || 500).json({
    message: err.message,
    statusCode: err.httpStatusCode || 500,
    status: err.httpStatusDesc || "INTERNAL_SERVER_ERROR",
  });
};

export default errorHandler;
