import { Box, Grid, Typography } from "@mui/material";
import LocationCard from "./LocationCard";

/**
 * LocationList component that displays a list of locations in a grid.
 * @param {Object} props - The component props
 * @param {Array} props.locations - The list of locations to display
 * @param {Function} props.onSave - The callback function to call when
 * the user updates a location name
 * @param {Function} props.onDelete - The callback function to call
 * when the user deletes a location
 * @returns {JSX.Element}
 */
const LocationList = ({ locations, onSave, onDelete }) => {
  return (
    <>
      {locations.length === 0 ? (
        <Typography variant="h6" sx={{ margin: 2 }}>
          No locations found
        </Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ margin: 2 }}>
            Saved Locations
          </Typography>

          <Grid container spacing={1}>
            {locations.map((location) => (
              <Grid item xs={12} key={location.id}>
                <LocationCard
                  location={location}
                  onSave={onSave}
                  onDelete={onDelete}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default LocationList;
