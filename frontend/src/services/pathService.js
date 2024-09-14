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
