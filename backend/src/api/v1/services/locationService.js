import Location from "../models/location.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import Sequelize from "sequelize";

/**
 * Creates or updates a location in the database.
 * @param {number} userId - The ID of the user associated with the location.
 * @param {string} address - The address of the location.
 * @param {string} googlePlaceId - The Google Place ID of the location.
 * @param {string} [name] - The name of the location (optional).
 * @returns {Location} - The created or updated location object.
 * @throws {BadRequestError} - If invalid location data is provided.
 */
export const createOrUpdateLocation = async (
  userId,
  address,
  googlePlaceId,
  name
) => {
  try {
    /*
      Upsert into the Locations table. If this combination of user_id and
      google_place_id already exists, update it's contents. If it doesn't
      exist, create a new row.
    */
    const [location, _] = await Location.upsert({
      name: name,
      address: address,
      google_place_id: googlePlaceId,
      user_id: userId,
      last_used: new Date(),
    });

    return location;
  } catch (error) {
    console.error("Error creating location:", error);

    if (error instanceof Sequelize.DatabaseError) {
      throw new BadRequestError(error.message);
    } else {
      throw error;
    }
  }
};

/**
 * Gets all locations associated with a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<Location>>} - An array of location objects.
 * @throws {Error} - An error if the locations cannot be listed.
 */
export const getAllLocations = async (userId) => {
  try {
    const locations = await Location.findAll({
      where: { user_id: userId },
      order: [["last_used", "DESC"]],
    });

    return locations;
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      throw new BadRequestError(error.message);
    }
    console.error("Error listing locations:", error);
    throw error;
  }
};

/**
 * Gets a single location by location id.
 * @param {number} userId - The ID of the user.
 * @param {number} locationId - The ID of the location.
 * @returns {Promise<Location>} - The location object.
 * @throws {NotFoundError} - If the location is not found.
 */
export const getOneLocation = async (userId, locationId) => {
  try {
    const location = await Location.findOne({
      where: { user_id: userId, id: locationId },
    });

    if (!location) {
      throw new NotFoundError("Location not found");
    }

    return location;
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
};

/**
 * Deletes a location by location id.
 * @param {number} userId - The ID of the user.
 * @param {number} locationId - The ID of the location.
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If the location is not found.
 */
export const deleteLocation = async (userId, locationId) => {
  try {
    const location = await Location.findOne({
      where: { user_id: userId, id: locationId },
    });

    if (!location) {
      throw new NotFoundError("Location not found");
    }

    await location.destroy();
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};
