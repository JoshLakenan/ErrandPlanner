/**
 * This function is used to catch errors in controller functions
 * and middleware functions and pass them to the error handling
 * middleware for processing, eliminating the need for try/catch
 * in each individual function.
 * @param {Function} handler - The controller function or middleware
 * @returns {Function} - The handler function with error handling.
 */
const asyncCatchError = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncCatchError;
