import { Alert } from "@mui/material";
import AddPath from "../components/AddPath";
import PathGrid from "../components/PathGrid";
import usePaths from "../hooks/usePaths";

/**
 * PathPage component fetches all paths from the backend and displays them in
 * a grid. It also allows the user to add a new path.
 * @returns {JSX.Element}
 */
const PathPage = () => {
  const { paths, error, setError, alert, setAlert, handleAddPath } = usePaths();

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
