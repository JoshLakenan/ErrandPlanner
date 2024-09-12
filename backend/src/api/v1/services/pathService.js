import Path from "../models/path.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import Sequelize from "sequelize";

/**
 * Get a single path sequelize instance by pathId.
 * @param {number} userId - The ID of the user.
 * @param {number} pathId - The ID of the path.
 * @returns {Path} - A path sequelize instance.
 * @throws {NotFoundError} - An error if the path cannot be found.
 */
const getOnePathInstance = async (userId, pathId) => {
  const path = await Path.findOne({
    where: { user_id: userId, id: pathId },
  });

  if (!path) {
    throw new NotFoundError("Path not found");
  }

  return path;
};

/**
 * Creates a new path with the provided name and user ID.
 * @param {number} userId - The ID of the user creating the path.
 * @param {string} [name] - The name of the path. (optional)
 * @returns {object} - The newly created path object JSON.
 */
export const createPath = async (userId, name) => {
  try {
    const path = await Path.create({
      name: name,
      user_id: userId,
    });

    return path.toJSON();
  } catch (error) {
    console.error("Error creating path:", error);
    throw error;
  }
};

/**
 * Gets all paths associated with a user.
 * @param {number} userId - The ID of the user.
 * @returns {Array<object>} - An array of JSON path objects.
 * @throws {Error} - An error if the paths cannot be listed.
 */
export const getAllPaths = async (userId) => {
  try {
    const paths = await Path.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return paths.map((path) => path.toJSON());
  } catch (error) {
    console.error("Error getting paths:", error);
    throw error;
  }
};

/**
 * Get a single path by pathId.
 * @param {number} userId - The ID of the user.
 * @param {number} pathId - The ID of the path.
 * @returns {Object} - A path object JSON.
 * @throws {NotFoundError} - An error if the path cannot be found.
 */
export const getOnePath = async (userId, pathId) => {
  try {
    const path = await getOnePathInstance(userId, pathId);

    return path.toJSON();
  } catch (error) {
    console.error("Error getting path:", error);
    throw error;
  }
};

/**
 * Updates a path with the provided ID and fields.
 * @param {number} userId - The ID of the user updating the path.
 * @param {number} pathId - The ID of the path to update.
 * @param {Object} fieldsObj - The fields to update. eg { name: "New Name" }
 * @returns {Object} - The updated path object JSON.
 * @throws {NotFoundError} - An error if the path cannot be found.
 * @throws {BadRequestError} - An error if fields provided are invalid.
 */
export const updatePath = async (userId, pathId, fieldsObj) => {
  try {
    const path = await getOnePathInstance(userId, pathId);

    // Update the path with the provided fields
    await path.update(fieldsObj);

    return path.toJSON();
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      throw new BadRequestError(error.message);
    }
    console.error("Error updating path:", error);
    throw error;
  }
};

/**
 * Deletes a path by pathId.
 * @param {number} userId - The ID of the user.
 * @param {number} pathId - The ID of the path.
 * @returns {void}
 * @throws {NotFoundError} - An error if the path cannot be found.
 */
export const deletePath = async (userId, pathId) => {
  try {
    const path = await getOnePathInstance(userId, pathId);

    await path.destroy();
  } catch (error) {
    console.error("Error deleting path:", error);
    throw error;
  }
};
