import { Grid, Typography, Link as MuiLink } from "@mui/material";

const PathCardContent = ({ path }) => {
  return (
    <Grid container spacing={2} alignItems="flex-start">
      {/* Left Column: Always visible Labels */}
      <Grid item xs={6}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Link
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Drive Time
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Distance
        </Typography>
      </Grid>

      {/* Right Column: Conditionally rendered Values */}
      <Grid item xs={6}>
        {/* Name always shown */}
        <Typography variant="body1">{path?.name || "N/A"}</Typography>

        {/* Conditionally show the link if it exists */}
        {path?.directionsUrl ? (
          <MuiLink
            href={path?.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
          >
            Open Directions
          </MuiLink>
        ) : null}

        {/* Conditionally show the drive time if it exists */}
        {path?.driveTimeSeconds ? (
          <Typography variant="body1">
            {Math.round(path.driveTimeSeconds / 60)} minutes
          </Typography>
        ) : null}

        {/* Conditionally show the distance if it exists */}
        {path?.distanceMeters ? (
          <Typography variant="body1">
            {(path?.distanceMeters / 1000).toFixed(2)} km
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default PathCardContent;
