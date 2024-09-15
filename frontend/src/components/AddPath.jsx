import { useState } from "react";
import {
  Box,
  Fab,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * AddPath component that allows the user to input a name and add a new path.
 * @param {Object} props - The component props
 * @param {Function} props.onAdd - The callback function to call when the user
 * adds a new path
 * @param {Function} props.setError - The callback function to call when a
 * validation error occurs
 * @returns {JSX.Element}
 */
const AddPath = ({ onAdd, setError }) => {
  const [newPathName, setNewPathName] = useState("");

  const handleChangeInput = (e) => {
    // Clear any existing error when the user provides new input
    if (setError) {
      setError(null);
    }
    setNewPathName(e.target.value);
  };

  const handleClickAdd = () => {
    // Validate the input
    if (!newPathName) {
      setError("Path name is required");
      return false;
    }
    // Format the new path object for the backend
    const newPath = { name: newPathName };

    onAdd(newPath);
  };

  return (
    <>
      <Card sx={{ mb: 2, height: "150px", width: "350" }}>
        <CardContent>
          <Box
            id="addPath"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "275px",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Add New Path
            </Typography>

            <Box
              id="addPathControls"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: 1,
              }}
            >
              <TextField
                label="Name"
                value={newPathName}
                onChange={handleChangeInput}
                variant="outlined"
                size="small"
              />
              <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickAdd}
                sx={{
                  width: 40,
                  height: 40,
                  marginRight: 2,
                }}
              >
                <AddIcon sx={{ fontSize: 40 }} />
              </Fab>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default AddPath;
