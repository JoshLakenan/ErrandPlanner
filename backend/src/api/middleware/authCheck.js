import jwt from "jsonwebtoken";
import asyncCatchError from "../utils/asyncCatchError";
import { UnauthorizedError } from "../utils/errors";

/**
 * Middleware function to check if the user is authenticated, by verifying the
 * JWT token in the Authorization header. Saves the decoded user object to the
 * request object for use in subsequent middleware functions.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const authCheck = asyncCatchError(async (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError("No token provided");
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      throw new UnauthorizedError("Invalid token");
    }

    // Save the decoded user object to the request object
    req.user = decodedUser;
    next();
  });
});

export default authCheck;
