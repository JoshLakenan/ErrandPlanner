import { useState, useEffect } from "react";
import { getAllPaths, createPath } from "../services/pathService";
import { Alert } from "@mui/material";
import AddPath from "../components/AddPath";
import PathGrid from "../components/PathGrid";

/**
 * PathPage component fetches all paths from the backend and displays them in
 * a grid. It also allows the user to add a new path.
 * @returns {JSX.Element}
 */
const PathPage = () => {
  const [paths, setPaths] = useState([]);
  const [error, setError] = useState(null);

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

  // Clear the error after 5 seconds when it's set
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
        console.log("Error cleared after 5 seconds");
      }, 5000);

      // Cleanup the timer when the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddPath = async (path) => {
    try {
      // Send reqeust to backend to create a new path
      const newPath = await createPath(path);

      // Update the paths state with the new path
      setPaths((prev) => [newPath, ...prev]);
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

      <PathGrid paths={paths} />
    </>
  );
};

export default PathPage;
