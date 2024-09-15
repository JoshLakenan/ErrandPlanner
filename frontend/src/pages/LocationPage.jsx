import { Alert, Box } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getAllLocations,
  createOrUpdateLocation,
  deleteLocation,
} from "../services/locationService";
import LocationList from "../components/LocationList";
import AddLocationCard from "../components/AddLocationCard";

/**
 * LocationPage component fetches all locations from the backend and displays them
 * in a list.
 * @returns {JSX.Element}
 */
const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

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

  // Clear the error after 5 seconds when it's set
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
        console.log("Error cleared after 5 seconds");
      }, 5000);

      // Cleanup the timer when the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateLocation = async (googlePlace) => {
    try {
      // Parse google Place object into a location object for the backend
      const location = {
        googlePlaceId: googlePlace.id,
        address: googlePlace.formattedAddress,
      };

      // Create the location in the backend
      const newLocation = await createOrUpdateLocation(location);

      // Update the state to add the new location
      setLocations((prev) => [newLocation, ...prev]);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create location");
    }
  };

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
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update location");
    }
  };

  const handleRequestError = (error) => {
    console.error(error);
    setError(error.message || "Google Places API request failed");
  };

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
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to delete location");
    }
  };

  return (
    <>
      <AddLocationCard
        onPlaceChange={handleCreateLocation}
        onRequestError={handleRequestError}
      />
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ width: "70%" }}>
          <LocationList
            locations={locations}
            onSave={handleUpdateLocation}
            onDelete={handleDeleteLocation}
          />
        </Box>
      )}
    </>
  );
};

export default LocationPage;
