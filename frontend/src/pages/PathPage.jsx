import { useState, useEffect } from "react";
import { getAllPaths, createPath } from "../services/pathService";
import { Alert } from "@mui/material";
import AddPath from "../components/AddPath";
import PathGrid from "../components/PathGrid";
import { Box, Typography } from "@mui/material";
import useTemporaryValue from "../hooks/useTemporaryValue";

/**
 * PathPage component fetches all paths from the backend and displays them in
 * a grid. It also allows the user to add a new path.
 * @returns {JSX.Element}
 */
const PathPage = () => {
  const [paths, setPaths] = useState([]);
  const [error, setError] = useTemporaryValue(null, 5000);
  const [alert, setAlert] = useTemporaryValue(null, 3000);

  // Fetch all paths on mount
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const paths = await getAllPaths();
        setPaths(paths);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Failed to fetch paths");
      }
    };

    fetchPaths();
  }, [error]);

  const handleAddPath = async (path) => {
    try {
      // Send reqeust to backend to create a new path
      const newPath = await createPath(path);

      // Update the paths state with the new path
      setPaths((prev) => [newPath, ...prev]);

      // Set the alert message
      setAlert("Path created successfully");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create path");
    }
  };

  return (
    <>
      <AddPath onAdd={handleAddPath} setError={setError} />

      {/* Error Alert */}
      {error && <Alert severity="error">{error}</Alert>}
      {alert && <Alert severity="success">{alert}</Alert>}

      <PathGrid paths={paths} />
    </>
  );
};

export default PathPage;
