import {
  createOrUpdateLocation,
  getAllLocations,
  getOneLocation,
  deleteLocation,
} from "../services/locationService.js";
import asyncCatchError from "../../utils/asyncCatchError.js";

/**
 * Parses the request body, interacts with the locationService to create or
 * update a location, and sends the newly created or updated location response.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const createOrUpdateLocationHandler = asyncCatchError(
  async (req, res) => {
    const { address, googlePlaceId, name } = req.body;
    const userId = req.user.id;

    const location = await createOrUpdateLocation(
      userId,
      address,
      googlePlaceId,
      name
    );

    res.status(201).json(location);
  }
);

/**
 * Parses the request body, interacts with the locationService to list all
 * locations associated with a user, and sends the list of locations response.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getAllLocationsHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;

  const locations = await getAllLocations(userId);

  res.status(200).json(locations);
});

/**
 * Parses the request parameters, interacts with the locationService to get a
 * single location, and sends the location response.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getOneLocationHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const locationId = req.params.locationId;

  const location = await getOneLocation(userId, locationId);

  res.status(200).json(location);
});

/**
 * Parses the request parameters, interacts with the locationService to delete a
 * location, and sends 204 no content response.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const deleteLocationHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const locationId = req.params.locationId;

  await deleteLocation(userId, locationId);

  res.status(204).end();
});
