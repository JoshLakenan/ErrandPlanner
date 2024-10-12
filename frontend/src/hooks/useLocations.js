import { useState, useEffect } from "react";
import {
  getAllLocations,
  createOrUpdateLocation,
  deleteLocation,
} from "../services/locationService";
import useTemporaryValue from "./useTemporaryValue";

/**
 * useLocations is a custom hook that manages the state of locations in the
 * application. It fetches all locations on mount and provides functions to
 * create, update, and delete locations.
 * @returns {object} - An object containing the locations state, error state,
 * alert state, and functions to create, update, and delete locations.
 * @example
 * const {
 *  locations,
 * error,
 * alert,
 * handleCreateLocation,
 * handleUpdateLocation,
 * handleRequestError,
 * handleDeleteLocation,
 * } = useLocations();
 */
const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useTemporaryValue(null, 5000);
  const [alert, setAlert] = useTemporaryValue(null, 3000);

  // Fetch all locations on mount and when error changes
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getAllLocations();
        setLocations(locations);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Failed to fetch locations");
      }
    };

    fetchLocations();
  }, [error]);

  /**
   * Creates a new location in the backend and updates the state with the new
   * location. Sets an error state if the request fails.
   * @param {object} googlePlace - The Google Place object to create a location from.
   * @returns {Promise<void>}
   */
  const handleCreateLocation = async (googlePlace) => {
    try {
      // Parse google Place object into a location object for the backend
      const location = {
        googlePlaceId: googlePlace.id,
        address: googlePlace.formattedAddress,
      };

      // Create the location in the backend
      const newLocation = await createOrUpdateLocation(location);

      // Update the state by checking to see if the location already exists,
      // if it does, update the location, otherwise add the new location
      setLocations((prev) => {
        const locationExists = prev.find(
          (loc) => loc.googlePlaceId === newLocation.googlePlaceId
        );
        return locationExists
          ? prev.map((loc) =>
              loc.googlePlaceId === newLocation.googlePlaceId
                ? newLocation
                : loc
            )
          : [newLocation, ...prev];
      });

      setAlert("Location added successfully");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create location");
    }
  };

  /**
   * Updates a location in the backend and updates the state with the updated
   * location. Sets an error state if the request fails.
   * @param {object} location - The location object to update.
   * @returns {Promise<void>}
   */
  const handleUpdateLocation = async (location) => {
    try {
      // Update the location in the backend
      const updatedLocation = await createOrUpdateLocation(location);

      // Update the state to reflect the updated location
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === updatedLocation.id ? updatedLocation : loc
        )
      );

      setAlert("Location updated successfully");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update location");
    }
  };

  /**
   * Sets an error state with the error message from a failed request.
   * @param {Error} error - The error object from the failed request.
   * @returns {void}
   * @example
   * handleRequestError(new Error("Google Places API request failed"));
   * // Sets the error state to "Google Places API request failed"
   */
  const handleRequestError = (error) => {
    console.error(error);
    setError(error.message || "Google Places API request failed");
  };

  /**
   * Deletes a location from the backend and updates the state to remove the
   * deleted location. Sets an error state if the request fails.
   * @param {string} locationId - The ID of the location to delete.
   * @returns {Promise<void>}
   * @example
   * handleDeleteLocation("1");
   * // Deletes the location with ID "1" from the backend and updates the state
   * // to remove the deleted location.
   * // Sets an error state if the request fails.
   * // Prompts the user to confirm the deletion.
   */
  const handleDeleteLocation = async (locationId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this location? \n" +
          "It will be removed from all associated paths permanently."
      )
    ) {
      return;
    }
    try {
      // Delete the location from the backend
      deleteLocation(locationId);
      // Update the state to remove the deleted location
      setLocations((prev) =>
        prev.filter((location) => location.id !== locationId)
      );

      setAlert("Location deleted successfully");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to delete location");
    }
  };

  return {
    locations,
    error,
    alert,
    handleCreateLocation,
    handleUpdateLocation,
    handleRequestError,
    handleDeleteLocation,
  };
};

export default useLocations;
