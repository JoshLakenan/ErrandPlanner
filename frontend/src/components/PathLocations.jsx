import LocationCard from "./LocationCard";
import LocationList from "./LocationList";
import { Box, Typography } from "@mui/material";

/**
 * Displays the origin, destination, and waypoints of a path, and allows the
 * user to update or remove them.
 * @param {Location} origin - The origin of the path
 * @param {Location} destination - The destination of the path
 * @param {Location[]} waypoints - The waypoints of the path
 * @param {function} handleUpdateLocation - Function to update a location
 * @param {function} handleRemoveLocationFromPath - Function to remove a location from the path
 * @returns {JSX.Element}
 */
const PathLocations = ({
  origin,
  destination,
  waypoints,
  handleUpdateLocation,
  handleRemoveLocationFromPath,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Start Location
      </Typography>
      <LocationCard
        location={origin}
        onSave={handleUpdateLocation}
        onDelete={() => handleRemoveLocationFromPath("origin", origin.id)}
      />

      <Typography variant="h6" sx={{ fontWeight: "bold", m: 1 }}>
        End Location
      </Typography>
      <LocationCard
        location={destination}
        onSave={handleUpdateLocation}
        onDelete={() =>
          handleRemoveLocationFromPath("destination", destination.id)
        }
      />

      <Typography variant="h6" sx={{ fontWeight: "bold", m: 1 }}>
        Errands
      </Typography>
      <LocationList
        locations={waypoints}
        onSave={handleUpdateLocation}
        onDelete={(locationId) =>
          handleRemoveLocationFromPath("waypoint", locationId)
        }
      />
    </Box>
  );
};

export default PathLocations;
