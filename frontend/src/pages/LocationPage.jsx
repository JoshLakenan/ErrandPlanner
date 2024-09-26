import { Alert, Box } from "@mui/material";
import LocationList from "../components/LocationList";
import AddLocationCard from "../components/AddLocationCard";
import useLocations from "../hooks/useLocations";

/**
 * LocationPage component fetches all locations from the backend and displays them
 * in a list.
 * @returns {JSX.Element}
 */
const LocationPage = () => {
  const {
    locations,
    error,
    alert,
    handleCreateLocation,
    handleUpdateLocation,
    handleRequestError,
    handleDeleteLocation,
  } = useLocations();

  return (
    <>
      <AddLocationCard
        onPlaceChange={handleCreateLocation}
        onRequestError={handleRequestError}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {alert && <Alert severity="success">{alert}</Alert>}

      <Box sx={{ width: "70%" }}>
        <LocationList
          locations={locations}
          onSave={handleUpdateLocation}
          onDelete={handleDeleteLocation}
        />
      </Box>
    </>
  );
};

export default LocationPage;
