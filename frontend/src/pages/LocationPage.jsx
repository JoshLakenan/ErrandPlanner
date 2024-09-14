import { Container, Grid, Typography, Box, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getAllLocations,
  createOrUpdateLocation,
  deleteLocation,
} from "../services/locationService";
import LocationList from "../components/LocationList";
import GoogleLocationSearch from "../components/GoogleLocationSearch";

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

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
        google_place_id: googlePlace.id,
        address: googlePlace.formattedAddress,
      };

      const newLocation = await createOrUpdateLocation(location);
      setLocations((prev) => [newLocation, ...prev]);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create location");
    }
  };

  const handleUpdateLocation = async (location) => {
    try {
      const updatedLocation = await createOrUpdateLocation(location);

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
      <GoogleLocationSearch
        onPlaceChange={handleCreateLocation}
        onRequestError={handleRequestError}
      />
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <LocationList
          locations={locations}
          onSaveLocation={handleUpdateLocation}
          onDeleteLocation={handleDeleteLocation}
        />
      )}
    </>
  );
};

export default LocationPage;
