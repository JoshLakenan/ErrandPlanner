import { Box, Grid, Typography } from "@mui/material";
import LocationCard from "./LocationCard";

/**
 * LocationList component that displays a list of locations in a grid.
 * @param {Object} props - The component props
 * @param {Array} props.locations - The list of locations to display
 * @param {Function} props.onSaveLocation - The callback function to call when
 * the user updates a location name
 * @param {Function} props.onDeleteLocation - The callback function to call
 * when the user deletes a location
 * @returns {JSX.Element}
 */
const LocationList = ({ locations, onSaveLocation, onDeleteLocation }) => {
  return (
    <Box>
      {locations.length === 0 ? (
        <Typography variant="h6" sx={{ margin: 2 }}>
          No locations added
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {locations.map((location) => (
            <Grid item xs={12} key={location.id}>
              <LocationCard
                location={location}
                onSave={onSaveLocation}
                onDelete={onDeleteLocation}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LocationList;
