import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocationList from "../components/LocationList";
import PathCardContent from "../components/PathCardContent";
import LocationCard from "../components/LocationCard";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import GoogleLocationSearch from "../components/GoogleLocationSearch";
import DropdownSelect from "../components/DropDownSelect";

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

const halfStyle = {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  "& > *": {
    margin: 1,
  },
};

const PathDetailPage = () => {
  //Get the state passed from the previous page
  const location = useLocation();
  const navigate = useNavigate();
  const { pathId } = useParams();

  // Path Meta State
  const [path, setPath] = useState(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState();

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
      handleTemporaryAlert(
        "Optimal Path calculated successfully! Path info updated."
      );
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
   * Display a temporary alert message for 2 seconds.
   * @param {String} alertMessage - The message to display in the alert.
   * @returns {void}
   */
  const handleTemporaryAlert = (alertMessage) => {
    setAlert(alertMessage);
    setTimeout(() => {
      setAlert(null);
    }, 2000);
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
      handleTemporaryAlert("Path name updated successfully");
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

      handleTemporaryAlert("Location added to path");
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
      handleTemporaryAlert("Location removed from path");
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

      handleTemporaryAlert("Location updated successfully");
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

  // Clear the error after 5 seconds when it's set
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      // Cleanup the timer when the component unmounts or error changes
      return () => clearTimeout(timer);
    }
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
            <Box
              sx={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                "& > *": {
                  margin: 1,
                },
              }}
            >
              {/* Path Info*/}
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Path Info
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  border: "1px solid",
                  borderColor: "grey.400",
                  borderRadius: "4px",
                  padding: "8px 16px",
                }}
              >
                <PathCardContent path={path} />
              </Box>

              {/* Edit Controls */}
              <Box
                id="editControls"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ mr: 2 }}
                  label="Update Name"
                  value={newName}
                  onChange={handlePathNameInputChange}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSaveNewPathName}
                  sx={{ width: "40px", height: "40px" }}
                >
                  Save
                </Button>

                <IconButton
                  aria-label="delete"
                  color="secondary"
                  size="medium"
                  onClick={handleDeletePath}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Calculate Path Button */}
              <Button
                onClick={handleCalculatePath}
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<MapIcon />}
                sx={{
                  mt: 1,
                  fontSize: "1rem",
                  width: "275px",
                }}
              >
                Calculate Path
              </Button>
            </Box>

            {/*Right Side * Add Location */}
            <Box
              sx={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                "& > *": {
                  margin: 1,
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Select A Location To Add to Path
              </Typography>

              {/* Select Dropdowns */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <DropdownSelect
                  label="Select Position"
                  items={[
                    { value: "origin", label: "Start" },
                    { value: "destination", label: "End" },
                    { value: "waypoint", label: "Errand" },
                  ]}
                  onValueChange={setNewLocPosition}
                  size={{ width: "200px", mr: 2 }}
                  defaultValue={"origin"}
                />
                <DropdownSelect
                  label="Location Source"
                  items={[
                    { value: "new", label: "Search For Location" },
                    {
                      value: "recent",
                      label: "Select Recent Location",
                    },
                  ]}
                  onValueChange={setSource}
                  size={{ width: "220px", mr: 2 }}
                  defaultValue={"new"}
                />
              </Box>

              {/* Location Search / Select */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  margin: 2,
                }}
              >
                {source === "new" ? (
                  // Google Search Box
                  <Box sx={{ width: "220px", m: 2 }}>
                    <GoogleLocationSearch
                      onPlaceChange={setNewSearchedLocation}
                      onRequestError={() =>
                        setError("Google Places API request failed")
                      }
                    />
                  </Box>
                ) : (
                  // Recent Location Dropdown
                  <DropdownSelect
                    label="Select Recent Location"
                    items={locations.map((loc) => ({
                      value: loc.id,
                      label: loc.name || loc.address,
                    }))}
                    onValueChange={setExistingLocationId}
                    size={{ width: "220px", mr: 2 }}
                  />
                )}

                {/* Add Location Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleAddLocationToPath}
                  sx={{ width: "40px", height: "40px", mr: 2 }}
                >
                  Add
                </Button>
              </Box>
              {error && <Alert severity="error">{error}</Alert>}
              {alert && <Alert severity="success">{alert}</Alert>}
            </Box>
          </CardContent>
        </Card>

        {/* Path Locations */}
        <Box>
          {/* Start */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Start Location
          </Typography>
          <LocationCard
            location={origin}
            onSave={handleUpdateLocation}
            onDelete={handleRemoveLocationFromPath.bind(null, "origin")}
          />

          {/* End */}
          <Typography variant="h6" sx={{ fontWeight: "bold", m: 1 }}>
            End Location
          </Typography>
          <LocationCard
            location={destination}
            onSave={handleUpdateLocation}
            onDelete={handleRemoveLocationFromPath.bind(null, "destination")}
          />

          {/* Errands */}
          <Typography variant="h6" sx={{ fontWeight: "bold", m: 1 }}>
            Errands
          </Typography>
          <LocationList
            locations={waypoints}
            onSave={handleUpdateLocation}
            onDelete={handleRemoveLocationFromPath.bind(null, "waypoint")}
          />
        </Box>
      </Box>
    </>
  );
};

export default PathDetailPage;
