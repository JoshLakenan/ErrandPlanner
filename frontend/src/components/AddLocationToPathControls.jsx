import { Box, Button, Typography, Alert } from "@mui/material";
import DropdownSelect from "./DropDownSelect";
import GoogleLocationSearch from "./GoogleLocationSearch";

/**
 * Displays controls for adding a location to a path, including selecting the
 * location's position in the path, the source of the location, and the location
 * itself.
 * @param {string} source - The source of the location to add to the path
 * @param {Location[]} locations - The list of recent locations
 * @param {function} setNewLocPosition - Function to set the new location's position
 * @param {function} setSource - Function to set the location source
 * @param {function} setNewSearchedLocation - Function to set the new searched location
 * @param {function} setExistingLocationId - Function to set the existing location ID
 * @param {function} handleAddLocationToPath - Function to handle adding a location to the path
 * @param {string} error - Error message to display
 * @param {string} alert - Alert message to display
 * @returns {JSX.Element}
 */
const AddLocationToPathControls = ({
  source,
  locations,
  setNewLocPosition,
  setSource,
  setNewSearchedLocation,
  setExistingLocationId,
  handleAddLocationToPath,
  error,
  alert,
}) => {
  return (
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
  );
};

export default AddLocationToPathControls;
