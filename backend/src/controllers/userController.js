import { createUser } from "../services/userService.js";
import asyncCatchError from "../utils/asyncCatchError.js";

/**
 * Parses the request body, interacts with the userService to create a new user,
 * and sends the newly created user response.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const createUserHandler = asyncCatchError(async (req, res) => {
  const { username, password } = req.body;

  const user = await createUser(username, password);

  res.status(201).json(user);
});
