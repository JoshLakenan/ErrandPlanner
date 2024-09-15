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
  // Path Meta Functions
  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleTemporaryAlert = (alertMessage) => {
    setAlert(alertMessage);
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
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
      console.log(newSearchedLocation);
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

  const handleUpdateLocation = async (position, location) => {
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
        console.log("Error cleared after 5 seconds");
      }, 5000);

      // Cleanup the timer when the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      <Box sx={{ width: "80%" }}>
        {/* Meta Info / Controls */}
        <Card sx={{ mb: 1 }}>
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Left Side - Path Info */}
            <Box
              sx={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Path Info
              </Typography>

              <PathCardContent path={path} />
            </Box>

            {/* Middle - Calculate Path */}
            <Box
              sx={{
                width: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Calculate Path
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              {alert && <Alert severity="success">{alert}</Alert>}

              <Button
                onClick={handleCalculatePath}
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<MapIcon />} // Adding the Map icon here
                sx={{
                  fontSize: "1.2rem", // Adjust the font size if needed
                  // padding: "12px 24px",
                  width: "250px",
                }}
              >
                Calculate
              </Button>
            </Box>

            {/* Right - Edit */}
            <Box
              sx={{
                width: 325,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Edit Path
              </Typography>

              <Box
                id="editControls"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  label="Update Name"
                  value={newName}
                  onChange={handleNewNameChange}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSaveNewPathName}
                >
                  Save
                </Button>

                <IconButton
                  aria-label="delete"
                  color="secondary"
                  size="small"
                  onClick={handleDeletePath}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Add Location */}

        <Card>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Select A Location To Add to Path
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              margin: 2,
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

            {/* Location Search / Select */}
            {source === "new" ? (
              <Box sx={{ width: "220px" }}>
                <GoogleLocationSearch
                  onPlaceChange={setNewSearchedLocation}
                  onRequestError={() =>
                    setError("Google Places API request failed")
                  }
                />
              </Box>
            ) : (
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
            >
              Add Location To Path
            </Button>
          </Box>
        </Card>

        {/* Locations */}
        <Box>
          <Typography variant="h6">Start Location</Typography>
          <LocationCard
            location={origin}
            onSave={handleUpdateLocation.bind(null, "origin")}
            onDelete={handleRemoveLocationFromPath.bind(null, "origin")}
          />

          <Typography variant="h6">Errands</Typography>
          <LocationList
            locations={waypoints}
            onSave={handleUpdateLocation.bind(null, "waypoint")}
            onDelete={handleRemoveLocationFromPath.bind(null, "waypoint")}
          />

          <Typography variant="h6">End Location</Typography>
          <LocationCard
            location={destination}
            onSave={handleUpdateLocation.bind(null, "destination")}
            onDelete={handleRemoveLocationFromPath.bind(null, "destination")}
          />
        </Box>
      </Box>
    </>
  );
};

export default PathDetailPage;
