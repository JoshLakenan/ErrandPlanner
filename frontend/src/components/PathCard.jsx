import {
  Card,
  CardContent,
  Typography,
  Link as MuiLink,
  Grid,
} from "@mui/material";

/**
 * PathCard component that displays a path's name, link, drive time, and distance.
 * @param {Object} props - The component props
 * @param {Object} props.path - The path object
 * @returns {JSX.Element}
 */
const PathCard = ({ path }) => {
  return (
    <Card sx={{ minWidth: 250, maxWidth: 300, margin: "auto", padding: 2 }}>
      <CardContent>
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
            <Typography variant="body1">{path.name || "N/A"}</Typography>

            {/* Conditionally show the link if it exists */}
            {path.directions_url ? (
              <MuiLink
                href={path.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="body1"
              >
                Open Directions
              </MuiLink>
            ) : null}

            {/* Conditionally show the drive time if it exists */}
            {path.drive_time_seconds ? (
              <Typography variant="body1">
                {Math.round(path.drive_time_seconds / 60)} minutes
              </Typography>
            ) : null}

            {/* Conditionally show the distance if it exists */}
            {path.distance_meters ? (
              <Typography variant="body1">
                {(path.distance_meters / 1000).toFixed(2)} km
              </Typography>
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PathCard;
