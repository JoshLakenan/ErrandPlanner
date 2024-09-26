import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PathDetailControls from "../components/PathDetailControls";
import AddLocationToPathControls from "../components/AddLocationToPathControls";
import PathLocations from "../components/PathLocations";

import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import useTemporaryValue from "../hooks/useTemporaryValue";

import {
  getAllLocations,
  createOrUpdateLocation,
} from "../services/locationService";

import {
  updatePath,
  deletePath,
  getPathLocations,
  addLocationToPath,
  removeLocationFromPath,
  calculatePath,
} from "../services/pathService";

const PathDetailPage = () => {
  //Get the state passed from the previous page
  const navigate = useNavigate();
  const { pathId } = useParams();

  // Path Meta State
  const [path, setPath] = useState(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useTemporaryValue(null, 5000);
  const [alert, setAlert] = useTemporaryValue(null, 3000);

  // Path Location State
  const [waypoints, setWaypoints] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  // Add Location to Path State
  const [newLocPosition, setNewLocPosition] = useState("origin");
  const [newSearchedLocation, setNewSearchedLocation] = useState(null); // Searched google Places location
  const [existingLocationId, setExistingLocationId] = useState(null); // Existing location id
  const [source, setSource] = useState("new"); // "new" or "esxisting"
  const [locations, setLocations] = useState([]);

  const fetchPathLocations = async () => {
    try {
      // Fetch the path locations from the backend
      const pathWithLocations = await getPathLocations(pathId);
      // Parse the returned locations into origin, destination, and waypoints

      // Set the state to reflect the fetched locations
      setPath(pathWithLocations);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to fetch path locations"
      );
    }
  };
  const fetchAllLocations = async () => {
    try {
      const locations = await getAllLocations();
      setLocations(locations);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to fetch locations");
    }
  };

  /**
   * Calculate the optimal path for the path in the backend and update the state.
   */
  const handleCalculatePath = async () => {
    try {
      // Calculate the path in the backend
      const calculatedPath = await calculatePath(pathId);
      setPath(calculatedPath);

      setAlert("Optimal Path calculated successfully! Path info updated.");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to calculate path");
    }
  };

  /**
   * Update the new name state when the input changes.
   * @param {Event} event - The input change event.
   * @returns {void}
   */
  const handlePathNameInputChange = (event) => {
    setNewName(event.target.value);
  };

  /**
   * Update the path name in the backend and update the state to reflect the change.
   */
  const handleSaveNewPathName = async () => {
    try {
      // Update the path name in the backend
      const updatedPath = await updatePath({ ...path, name: newName });

      // Update the state to reflect the updated path
      setPath((prev) => ({ ...prev, name: updatedPath.name }));

      // Alert that the operation was successful, and clear the input
      setAlert("Path name updated successfully");
      setNewName("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update path name");
    }
  };

  /**
   * Delete the path in the backend and navigate to the home page, after
   * getting confirmation from the user.
   * @returns {Promise<void>}
   */
  const handleDeletePath = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this path?" +
          "The path will be deleted permanently, but the added locations will" +
          "remain in your saved locations."
      )
    ) {
      return;
    }
    try {
      // Delete the path in the backend
      await deletePath(pathId);

      // Navigate to the home page
      navigate("/paths");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to delete path");
    }
  };

  /**
   * Check if the new location is valid based on the source and set
   * errors if appropriate.
   * @returns {Boolean} - True if the new location is valid, false otherwise.
   */
  const newLocationIsValid = () => {
    if (source === "new" && !newSearchedLocation) {
      setError("Please search for a location to add to the path");
      return false;
    }

    if (source === "existing" && !existingLocationId) {
      setError("Please select a location to add to the path");
      return false;
    }

    return true;
  };

  /**
   * Get the formatted new location object to add to the path.
   * If the source is "new", the newSearchedLocation object is used.
   * If the source is "existing", the existingLocationId is used to find the location.
   * @returns {Object} - The formatted new location object.
   */
  const getFormattedNewLocation = () => {
    let formattedNewLocation = null;

    if (source === "new") {
      formattedNewLocation = {
        address: newSearchedLocation.formattedAddress,
        googlePlaceId: newSearchedLocation.id,
      };
    } else {
      // Find the location using the existingLocationId
      formattedNewLocation = locations.find(
        (loc) => loc.id === existingLocationId
      );
    }

    // Add position to the location object
    formattedNewLocation.position = newLocPosition;

    return formattedNewLocation;
  };

  // Path Location Functions
  const handleAddLocationToPath = async () => {
    // Check if the new location is valid
    if (!newLocationIsValid()) return;

    // Format the new location object to include the position
    const formattedNewLocation = getFormattedNewLocation();

    try {
      // Create the location in the backend
      const updatedPath = await addLocationToPath(pathId, formattedNewLocation);

      setPath(updatedPath);

      setAlert("Location added to path");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to add location to path"
      );
    }
  };

  /**
   * Update the ordered location state based on the locations array.
   * @param {Array} locations - The locations array to update the state with.
   * @returns {void}
   */
  const updateOrderedLocationState = (locations) => {
    if (!locations) return;

    const origin = locations.find((loc) => loc.position === "origin");
    const destination = locations.find((loc) => loc.position === "destination");
    const waypoints = locations.filter((loc) => loc.position === "waypoint");

    setOrigin(origin);
    setDestination(destination);
    setWaypoints(waypoints);
  };

  /**
   * Remove the location from the path in the backend and update the state to reflect the change.
   * @param {String} position - The position of the location to remove.
   * @param {String} locationId - The id of the location to remove.
   * @returns {void}
   */
  const handleRemoveLocationFromPath = async (position, locationId) => {
    try {
      // Format the location object to include the position
      const locationDetails = { locationId, position };

      // Remove the location from the path in the backend
      const updatedPath = await removeLocationFromPath(pathId, locationDetails);

      setPath(updatedPath);
      setAlert("Location removed from path");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to remove location from path"
      );
    }
  };

  /**
   * Update the location in the backend and update the state to reflect the change.
   * @param {Object} location - The location object to update.
   * @returns {void}
   */
  const handleUpdateLocation = async (location) => {
    try {
      // Update the location in the backend
      const renamedLocation = await createOrUpdateLocation(location);

      // Update the names of any locations in the path that match the updated location
      setPath((prev) => {
        const updatedLocations = prev.locations.map((loc) =>
          loc.id === renamedLocation.id
            ? { ...loc, name: renamedLocation.name }
            : loc
        );

        return { ...prev, locations: updatedLocations };
      });

      setLocations((prev) => {
        const updatedLocations = prev.map((loc) =>
          loc.id === renamedLocation.id
            ? { ...loc, name: renamedLocation.name }
            : loc
        );

        return updatedLocations;
      });

      setAlert("Location updated successfully");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update location");
    }
  };

  // On mount, fetch the path locations and all locations
  useEffect(() => {
    fetchPathLocations();
    fetchAllLocations();
  }, [error]);

  // Update the ordered location state when the path changes
  useEffect(() => {
    if (path) {
      updateOrderedLocationState(path.locations);
    }
  }, [path]);

  // Clear the new new Location data when the source changes
  useEffect(() => {
    setNewSearchedLocation(null);
    setExistingLocationId(null);
  }, [source]);

  return (
    <>
      {/* Page */}
      <Box sx={{ width: "80%" }}>
        {/* Meta Info / Controls */}
        <Card sx={{ mb: 1 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {/* Left side * Info / Edit */}
            <PathDetailControls
              path={path}
              newName={newName}
              onPathNameChange={(e) => setNewName(e.target.value)}
              onSaveNewPathName={handleSaveNewPathName}
              onDeletePath={handleDeletePath}
              onCalculatePath={handleCalculatePath}
              alert={alert}
              error={error}
            />

            {/*Right Side * Add Location */}
            <AddLocationToPathControls
              source={source}
              locations={locations}
              setNewLocPosition={setNewLocPosition}
              setSource={setSource}
              setNewSearchedLocation={setNewSearchedLocation}
              setExistingLocationId={setExistingLocationId}
              handleAddLocationToPath={handleAddLocationToPath}
              error={error}
              alert={alert}
            />
          </CardContent>
        </Card>

        {/* Path Locations */}
        <PathLocations
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          handleUpdateLocation={handleUpdateLocation}
          handleRemoveLocationFromPath={handleRemoveLocationFromPath}
        />
      </Box>
    </>
  );
};

export default PathDetailPage;
