import User from "../models/user.js";
import {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} from "../../utils/errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Creates a new user with the provided username and password, after first
 * ensuring that the username is unique, and hashing the provided password.
 * @param {String} username
 * @param {String} password
 * @throws {ConflictError} - An error if the user cannot be created.
 * @returns {Promise<User>} - The newly created user.
 */
export const createUser = async (username, password) => {
  try {
    // Ensure that the username is unique
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictError("Username unavailable");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await User.create({
      username,
      hashed_password: hashedPassword,
    });

    // Create a userPlain object with only the necessary fields
    const userPlain = {
      id: user.id,
      username: user.username,
    };

    return userPlain;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Checks if the provided password matches the hashed password of the user, and
 * returns a JWT token if the credentials are valid.
 * @param {String} username - The username of the user.
 * @param {String} password - The password to check.
 * @throws {UnauthorizedError} - An error if the credentials are invalid.
 * @returns {String} - A JWT token if the credentials are valid.
 */
export const loginUser = async (username, password) => {
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if provided password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: `${process.env.JWT_EXPIRES_IN}`,
      }
    );

    return token;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
