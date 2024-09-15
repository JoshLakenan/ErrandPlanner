import { Typography, Box, Card, CardContent } from "@mui/material";
import GoogleLocationSearch from "../components/GoogleLocationSearch";

const AddLocationCard = ({ onPlaceChange, onRequestError }) => {
  return (
    <Card sx={{ mb: 1, height: "150px", width: "350" }}>
      <CardContent>
        <Box sx={{ margin: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Search for a new location
          </Typography>
          <GoogleLocationSearch
            onPlaceChange={onPlaceChange}
            onRequestError={onRequestError}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddLocationCard;
