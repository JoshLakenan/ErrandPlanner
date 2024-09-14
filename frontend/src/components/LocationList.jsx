import { Box, Grid } from "@mui/material";
import LocationCard from "./LocationCard";

const LocationList = ({ locations, onSaveLocation, onDeleteLocation }) => {
  if (locations.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        maxHeight: "90%",
        overflowY: "auto",
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
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
    </Box>
  );
};

export default LocationList;
