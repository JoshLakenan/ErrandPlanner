import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * LocationCard component that displays a location's address, name, and allows
 * the user to edit the name.
 * @param {Object} props - The component props
 * @param {Object} props.location - The location object
 * @param {Function} props.onSave - The callback function to call when the user
 * saves the updated location
 * @param {Function} props.onDelete - The callback function to call when the user
 * deletes the location
 * @returns {JSX.Element}
 */
const LocationCard = ({ location, onSave, onDelete }) => {
  const [newName, setNewName] = useState("");

  // Handle input change
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  // Handle delete action
  const handleDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this location?\n" +
          "It will be removed from all associated paths permanently."
      )
    ) {
      return;
    }
    onDelete(location.id);
  };

  // Handle save action
  const handleSave = () => {
    if (!newName) {
      return;
    }
    const newLocation = { ...location, name: newName };
    setNewName("");

    onSave(newLocation);
  };

  return (
    <Card sx={{ padding: 1 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box id={"address"} sx={{ width: 300 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Address
            </Typography>
            <Box id="addressValue">
              <Typography variant="subtext1">{location.address}</Typography>
            </Box>
          </Box>

          <Box id={"name"} sx={{ width: 150 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Name
            </Typography>
            <Box id="nameValue">
              <Typography variant="subtext1">{location.name}</Typography>
            </Box>
          </Box>

          <Box
            id={"edit"}
            sx={{
              width: 325,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Edit
            </Typography>

            <Box
              id="editControls"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: 1,
              }}
            >
              <TextField
                label="Update Name"
                value={newName}
                onChange={handleNameChange}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSave}
              >
                Save
              </Button>

              <IconButton
                aria-label="delete"
                color="secondary"
                size="small"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
