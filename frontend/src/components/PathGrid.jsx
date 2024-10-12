import { Box, Grid, Typography } from "@mui/material";
import PathCard from "./PathCard";

/**
 * PathGrid component that displays a grid of paths.
 * @param {Object} props - The component props
 * @param {Array} props.paths - The array of paths to display
 * @returns {JSX.Element}
 */
const PathGrid = ({ paths }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {paths.length === 0 ? (
        <Typography variant="h6" sx={{ margin: 2 }}>
          No paths found
        </Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ margin: 2 }}>
            Saved Paths
          </Typography>

          <Grid container spacing={2}>
            {paths.map((path) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={path.id}>
                <PathCard path={path} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PathGrid;
