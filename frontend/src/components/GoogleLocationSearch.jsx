import {
  APILoader,
  PlacePicker,
} from "@googlemaps/extended-component-library/react";

import { Typography, Box, Card, CardContent } from "@mui/material";

const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY;

/**
 * GoogleLocationSearch component that allows users to search for a location
 * using the Google Places API.
 * @param {Object} props - The component props
 * @param {Function} props.onPlaceChange - The callback function to call when a
 * place is selected
 * @param {Function} props.onRequestError - The callback function to call when
 * an error occurs during the request
 * @returns {JSX.Element}
 */
const GoogleLocationSearch = ({ onPlaceChange, onRequestError }) => {
  /**
   * Handles place change event, ensuring the place is not empty before calling
   * the onPlaceChange callback.
   * @param {Object} event - The place change event object
   * @returns {void}
   */
  const handlePlaceChange = (event) => {
    if (event.target.value) {
      onPlaceChange(event.target.value);
    }
  };

  return (
    <Card sx={{ margin: 1, height: "150px", width: "350" }}>
      <CardContent>
        <Box sx={{ margin: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Search for a new location
          </Typography>
          <Box>
            <APILoader apiKey={mapsApiKey} />
            <PlacePicker
              onPlaceChange={handlePlaceChange}
              onRequestError={() => (error) => onRequestError(error)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoogleLocationSearch;
