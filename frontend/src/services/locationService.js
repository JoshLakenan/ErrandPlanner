import apiClient from "./backendApiClient";

/**
 * Gets all locations from the server for the current user.
 * @returns {Promise<Array>} - A promise that resolves to an array of locations.
 */
export const getAllLocations = async () => {
  const response = await apiClient.get("/locations");

  return response.data;
};

/**
 * Creates a new location or updates an existing location on the server.
 * @param {Object} location - { address: String, google_place_id: String, name: String }
 * @returns {Promise<Object>} - A promise that resolves to the created or updated location.
 */
export const createOrUpdateLocation = async (location) => {
  const response = await apiClient.post("/locations", location);

  return response.data;
};

/**
 * Deletes a location on the server.
 * @param {String} locationId - The ID of the location to delete.
 */
export const deleteLocation = async (locationId) => {
  const response = await apiClient.delete(`/locations/${locationId}`);

  return response.data;
};
