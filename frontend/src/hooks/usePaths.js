import { useState, useEffect } from "react";
import useTemporaryValue from "./useTemporaryValue";
import { getAllPaths, createPath } from "../services/pathService";

/**
 * usePaths is a custom hook that manages the state of paths in the application.
 * It fetches all paths on mount and provides a function to add a new path.
 * @returns {object} - An object containing the paths state, error state, alert
 * state, and functions to add a new path, set the error state, and set the alert state.
 * @example
 * const { paths, error, setError, alert, setAlert, handleAddPath } = usePaths();
 */
const usePaths = () => {
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

  /**
   * Creates a new path in the backend and updates the state with the new path.
   * Sets an error state if the request fails.
   * @param {object} path - The path object to create.
   * @returns {Promise<void>}
   */
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

  return {
    paths,
    error,
    setError,
    alert,
    setAlert,
    handleAddPath,
  };
};

export default usePaths;
