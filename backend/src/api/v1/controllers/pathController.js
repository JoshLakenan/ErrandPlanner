import {
  createPath,
  getAllPaths,
  updatePath,
  deletePath,
} from "../services/pathService.js";
import {
  getOnePathWithLocations,
  addLocationToPath,
  removeLocationFromPath,
} from "../services/pathLocationService.js";
import asyncCatchError from "../../utils/asyncCatchError.js";

// Create a new path
export const createPathHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const name = req.body.name;

  const path = await createPath(userId, name);

  res.status(201).json(path);
});

// Get all paths
export const getAllPathsHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;

  const paths = await getAllPaths(userId);

  res.status(200).json(paths);
});

// Update a path
export const updatePathHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const pathId = req.params.pathId;
  const fieldsObj = req.body;

  const updatedPath = await updatePath(userId, pathId, fieldsObj);

  res.status(200).json(updatedPath);
});

// Delete a path
export const deletePathHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const pathId = req.params.pathId;

  await deletePath(userId, pathId);

  res.status(204).end();
});

// Add a location to a path
export const addLocationToPathHandler = asyncCatchError(async (req, res) => {
  const userId = req.user.id;
  const pathId = req.params.pathId;
  const { position, address, googlePlaceId, name } = req.body;

  const updatedPath = await addLocationToPath(
    userId,
    pathId,
    position,
    address,
    googlePlaceId,
    name
  );

  res.status(201).json(updatedPath);
});

// Get a single path with locations
export const getOnePathWithLocationsHandler = asyncCatchError(
  async (req, res) => {
    const userId = req.user.id;
    const pathId = req.params.pathId;

    const path = await getOnePathWithLocations(userId, pathId);

    res.status(200).json(path);
  }
);

// Remove a location from a path
export const removeLocationFromPathHandler = asyncCatchError(
  async (req, res) => {
    const userId = req.user.id;
    const pathId = req.params.pathId;
    const { locationId, position } = req.body;

    const updatedPath = await removeLocationFromPath(
      userId,
      pathId,
      locationId,
      position
    );

    res.status(200).json(updatedPath);
  }
);
