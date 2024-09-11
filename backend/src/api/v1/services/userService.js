import User from "../models/user.js";
import { ConflictError } from "../../utils/errors.js";
import bcrypt from "bcrypt";

/**
 * Creates a new user with the provided username and password, after first
 * ensuring that the username is unique, and hashing the provided password.
 * @param {String} username
 * @param {String} password
 * @throws {ConflictError} - An error if the user cannot be created.
 * @returns {Promise<User>} - The newly created user.
 */
export async function createUser(username, password) {
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
}
