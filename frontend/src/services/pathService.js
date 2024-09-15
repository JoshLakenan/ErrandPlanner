import apiClient from "./backendApiClient";

/**
 * Gets all paths from the server for the current user.
 * @returns {Promise<Array>} - A promise that resolves to an array of paths.
 */
export const getAllPaths = async () => {
  const response = await apiClient.get("/paths");

  return response.data;
};

/**
 * Creates a new path or updates an existing path on the server.
 * @param {Object} path - { name: String }
 * @returns {Promise<Object>} - A promise that resolves to the created or updated path.
 */
export const createPath = async (path) => {
  const response = await apiClient.post("/paths", path);

  return response.data;
};

/**
 * Deletes a path on the server.
 * @param {String} pathId - The ID of the path to delete.
 */
export const deletePath = async (pathId) => {
  const response = await apiClient.delete(`/paths/${pathId}`);

  return response.data;
};

/**
 * Updates a path on the server.
 * @param {object} path - The path object to update.
 * @returns {Promise<Object>} - A promise that resolves to the updated path.
 */
export const updatePath = async (path) => {
  const response = await apiClient.put(`/paths/${path.id}`, path);

  return response.data;
};

/**
 * Gets a path with associated locations from the server.
 * @param {String} pathId - The ID of the path to get.
 * @returns {Promise<Object>} - A promise that resolves to the path with locations.
 */
export const getPathLocations = async (pathId) => {
  const response = await apiClient.get(`/paths/${pathId}/locations`);

  return response.data;
};

/**
 * Adds a location to a path on the server.
 * @param {String} pathId - The ID of the path to add the location to.
 * @param {Object} location - The location to add. Ex)
 * {
 *    name: String, // optional
 *    google_place_id: String,
 *    address: String,
 *    position: "origin" | "destination" | "waypoint",
 *  }
 * @returns {Promise<Object>} - A promise that resolves to the updated path.
 */
export const addLocationToPath = async (pathId, location) => {
  console.log("location in service: ", location);
  const response = await apiClient.post(`/paths/${pathId}/locations`, location);

  return response.data;
};

/**
 * Removes a location from a path on the server.
 * @param {String} pathId - The ID of the path to remove the location from.
 * @param {Object} location - The location to remove. Ex)
 * {
 *   locationId: Number,
 *   position: "origin" | "destination" | "waypoint",
 * }
 * @returns {Promise<Object>} - A promise that resolves to the updated path.
 */
export const removeLocationFromPath = async (pathId, location) => {
  const response = await apiClient.patch(
    `/paths/${pathId}/locations`,
    location
  );

  return response.data;
};

/**
 * Updates the path on the server after calculating an optimal route.
 * @param {String} pathId - The ID of the path to calculate.
 * @returns {Promise<Object>} - A promise that resolves to the updated path.
 */
export const calculatePath = async (pathId) => {
  const response = await apiClient.patch(`/paths/${pathId}/calculate`);

  return response.data;
};
