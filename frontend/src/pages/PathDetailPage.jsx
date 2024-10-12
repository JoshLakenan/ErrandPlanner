import PathDetailControls from "../components/PathDetailControls";
import AddLocationToPathControls from "../components/AddLocationToPathControls";
import PathLocations from "../components/PathLocations";
import usePathDetails from "../hooks/usePathDetails";
import { Box, Card, CardContent } from "@mui/material";

/**
 * Displays the path detail page, including the path's meta info and controls,
 * and the path's locations.
 * @returns {JSX.Element}
 */
const PathDetailPage = () => {
  const {
    path,
    newName,
    handlePathNameInputChange,
    handleSaveNewPathName,
    handleDeletePath,
    handleCalculatePath,
    alert,
    error,
    waypoints,
    origin,
    destination,
    setNewLocPosition,
    setNewSearchedLocation,
    setExistingLocationId,
    source,
    setSource,
    locations,
    handleAddLocationToPath,
    handleRemoveLocationFromPath,
    handleUpdateLocation,
  } = usePathDetails();

  return (
    <>
      {/* Page */}
      <Box sx={{ width: "80%" }}>
        {/* Meta Info / Controls */}
        <Card sx={{ mb: 1 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {/* Left side * Info / Edit */}
            <PathDetailControls
              path={path}
              newName={newName}
              onPathNameChange={handlePathNameInputChange}
              onSaveNewPathName={handleSaveNewPathName}
              onDeletePath={handleDeletePath}
              onCalculatePath={handleCalculatePath}
            />

            {/*Right Side * Add Location */}
            <AddLocationToPathControls
              source={source}
              locations={locations}
              setNewLocPosition={setNewLocPosition}
              setSource={setSource}
              setNewSearchedLocation={setNewSearchedLocation}
              setExistingLocationId={setExistingLocationId}
              handleAddLocationToPath={handleAddLocationToPath}
              error={error}
              alert={alert}
            />
          </CardContent>
        </Card>

        {/* Path Locations */}
        <PathLocations
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          handleUpdateLocation={handleUpdateLocation}
          handleRemoveLocationFromPath={handleRemoveLocationFromPath}
        />
      </Box>
    </>
  );
};

export default PathDetailPage;
