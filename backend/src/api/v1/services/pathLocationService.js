import Path from "../models/path.js";
import { Op } from "sequelize";
import Location from "../models/location.js";
import PathLocation from "../models/pathLocation.js";
import { createOrUpdateLocation } from "./locationService.js";
import { getOnePath } from "./pathService.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import Sequelize from "sequelize";

/**
 * Gets a single path and its associated locations by pathId.
 * @param {number} userId - The ID of the user.
 * @param {number} pathId - The ID of the path.
 * @returns {object} - The path object with associated locations.
 * @throws {NotFoundError} - An error if the path cannot be found.
 */
export const getOnePathWithLocations = async (userId, pathId) => {
  try {
    // Get the path instance
    const path = await getOnePath(userId, pathId);

    // Get the locations associated with the path
    const pathLocations = await PathLocation.findAll({
      where: { path_id: pathId },
      include: Location,
    });

    // Create a JSON object with the path and associated locations
    path.locations = pathLocations.map((pathLocation) => {
      const locationJSON = pathLocation.Location.toJSON();
      locationJSON.position = pathLocation.position;
      return locationJSON;
    });

    return path;
  } catch (error) {
    console.error("Error getting path:", error);
    throw error;
  }
};

/**
 * Adds a location to a path with the provided position. If the path already
 * contains a origin or destination, and the position argument is "origin" or
 * "destination", the existing location will be replaced.
 * @param {number} userId - The ID of the user adding the location.
 * @param {number} pathId - The ID of the path to add the location to.
 * @param {Location} location - The sequelize Location object to add.
 * @param {"origin" | "waypoint" | "destination"} position - The position of the location in the path.
 * @returns {object} - The path object with the added location
 * @throws {NotFoundError} - An error if the path or location cannot be found.
 * @throws {BadRequestError} - An error if the position is invalid.
 * @throws {Error} - An error if the location cannot be added to the path.
 */
export const addLocationToPath = async (
  userId,
  pathId,
  position,
  address,
  googlePlaceId,
  name
) => {
  try {
    // Find the path by pathId
    const path = await getOnePath(userId, pathId);

    // Create or update the location in the database
    const location = await createOrUpdateLocation(
      userId,
      address,
      googlePlaceId,
      name
    );

    // Ensure that there is only one origin and one destination in the path
    if (position === "origin" || position === "destination") {
      // Find the existing location at the position
      const existingLocation = await PathLocation.findOne({
        where: { path_id: pathId, position: position },
      });

      // If an existing location is found, update it with the new location
      if (existingLocation) {
        await existingLocation.update({ location_id: location.id });
      } else {
        //Otherwise, add the location to the path
        await PathLocation.create({
          path_id: pathId,
          location_id: location.id,
          position,
        });
      }
    } else {
      // If the waypoint position is already the origin or destination position
      const existingLocation = await PathLocation.findOne({
        where: {
          path_id: pathId,
          location_id: location.id,
          position: {
            [Op.or]: ["origin", "destination"],
          },
        },
      });

      if (existingLocation) {
        throw new BadRequestError(
          "Location already exists as origin or destination"
        );
      }
      /*
        Upsert "waypoint" locations to the path, ensuring that there are no
        duplicate waypoint locations, but allowing multiple waypoints to be
        added.
      */
      await PathLocation.upsert({
        path_id: pathId,
        location_id: location.id,
        position,
      });
    }

    // Get the updated path with the associated locations
    const updatedPath = await getOnePathWithLocations(userId, pathId);

    return updatedPath;
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      throw new BadRequestError(error.message);
    }
    console.error("Error adding location to path:", error);
    throw error;
  }
};

/**
 * Removes a location from a path by pathId and locationId.
 * @param {number} userId - The ID of the user removing the location.
 * @param {number} pathId - The ID of the path to remove the location from.
 * @param {number} locationId - The ID of the location to remove.
 * @param {position} position - The position of the location in the path.
 * @returns {object} - The path object with the location removed.
 * @throws {NotFoundError} - An error if the path or location cannot be found.
 * @throws {Error} - An error if the location cannot be removed from the path.
 * @throws {BadRequestError} - An error if the location is not in the path.
 */
export const removeLocationFromPath = async (
  userId,
  pathId,
  locationId,
  position
) => {
  try {
    // Find the path by pathId, ensuring that it exists and the user owns it
    const path = await getOnePath(userId, pathId);

    // Find the PathLocation by pathId and locationId
    const pathLocation = await PathLocation.findOne({
      where: { path_id: pathId, location_id: locationId, position },
    });

    if (!pathLocation) {
      throw new NotFoundError("Location not found in path");
    }

    // Remove the location from the path
    await pathLocation.destroy();

    // Get the updated path with the associated locations
    const updatedPath = await getOnePathWithLocations(userId, pathId);

    return updatedPath;
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      throw new BadRequestError(error.message);
    }
    console.error("Error removing location from path:", error);
    throw error;
  }
};
