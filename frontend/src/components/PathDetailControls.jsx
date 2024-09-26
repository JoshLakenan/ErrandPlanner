import PathCardContent from "./PathCardContent";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";

/**
 * Displays controls for updating a path's name, deleting the path, and
 * calculating the path.
 * @param {Path} path - The path to display
 * @param {string} newName - The new name for the path
 * @param {function} onPathNameChange - Function to handle updating the path's name
 * @param {function} onSaveNewPathName - Function to handle saving the new path name
 * @param {function} onDeletePath - Function to handle deleting the path
 * @param {function} onCalculatePath - Function to handle calculating the path
 * @param {string} alert - Alert message to display
 * @param {string} error - Error message to display
 * @returns {JSX.Element}
 */
const PathDetailControls = ({
  path,
  newName,
  onPathNameChange,
  onSaveNewPathName,
  onDeletePath,
  onCalculatePath,
  alert,
  error,
}) => {
  return (
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
          onChange={onPathNameChange}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onSaveNewPathName}
        >
          Save
        </Button>

        <IconButton
          aria-label="delete"
          color="secondary"
          onClick={onDeletePath}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Button
        onClick={onCalculatePath}
        variant="contained"
        color="secondary"
        startIcon={<MapIcon />}
      >
        Calculate Path
      </Button>
    </Box>
  );
};

export default PathDetailControls;
